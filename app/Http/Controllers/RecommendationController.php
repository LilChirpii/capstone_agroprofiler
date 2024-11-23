<?php

namespace App\Http\Controllers;

use App\Models\Farmer;
use App\Models\Barangay;
use App\Models\Commodity;
use App\Models\Allocation;
use App\Models\AllocationType;
use App\Models\CropDamageCause;
use App\Models\Elligibility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecommendationController extends Controller
{
    public function index(Request $request)
    {
        $allocationTypes = AllocationType::with(['elligibilities', 'barangays', 'cropDamageCauses', 'commodities'])->get();

        $allocationTypeId = $request->input('allocation_type_id');
        $allocationType = null;
        $scoredFarmers = collect();

        if ($allocationTypeId) {
            $allocationType = AllocationType::with(['elligibilities', 'barangays', 'cropDamageCauses', 'commodities'])
                                            ->findOrFail($allocationTypeId);

            $eligibleFarmers = $this->getEligibleFarmers($allocationType)
                                    ->load(['farms.commodity', 'cropDamages.cropDamageCause']); 

            $scoredFarmers = $eligibleFarmers->map(function ($farmer) use ($allocationType) {
                $scoringDetails = $this->calculateFarmerScore($farmer, $allocationType);
                $rsbsaRefNo = $farmer->status === 'registered' ? $farmer->rsbsa_ref_no : '';
                $barangayName = optional($farmer->barangay)->name ?? 'Unknown Barangay';
                
                return [
                    'barangay' => $barangayName,
                    'rsbsaRefNo' => $rsbsaRefNo,
                    'id' => $farmer->id,
                    'farmerName' => $farmer->firstname . ' ' . $farmer->lastname,
                    'commodity' => optional($farmer->farms->first())->commodity->name ?? 'No Commodity',
                    'allocationType' => $allocationType->name,
                    'score' => $scoringDetails['score'],
                    'reasons' => $scoringDetails['reasons'],
                ];
            });
            
            $rankedFarmers = $scoredFarmers->sortByDesc('score')->values();

            $currentRank = 1;
            $previousScore = null;

            $rankedFarmers->transform(function ($farmer) use (&$currentRank, &$previousScore) {
                if ($farmer['score'] === $previousScore) {
                    $farmer['ranking'] = $currentRank;
                } else if ($farmer['score'] > $previousScore) {
                    $previousScore = $farmer['score'];
                    $farmer['ranking'] = $currentRank;
                    $currentRank++;
                }
                return $farmer;
            });
        }

        return Inertia::render('Super Admin/Reports/Recommendations', [
            'allocationTypes' => $allocationTypes,
            'allocationType' => $allocationType,
            'farmers' => $scoredFarmers,
            'allocationDetails' => $allocationType ? $this->getAllocationDetailsParagraph($allocationType) : null,
        ]);
    }

    public function recommendAllocations(Request $request)
    {
        $allocationTypeId = $request->input('allocation_type_id');
        $allocationType = AllocationType::with(['elligibilities', 'barangays', 'cropDamageCauses', 'commodities'])
                                        ->findOrFail($allocationTypeId);

        $eligibleFarmers = $this->getEligibleFarmers($allocationType)
                                ->load(['farms.commodity', 'cropDamages.cropDamageCause']); 

        $scoredFarmers = $eligibleFarmers->map(function ($farmer) use ($allocationType) {
            $scoringDetails = $this->calculateFarmerScore($farmer, $allocationType);
            $rsbsaRefNo = $farmer->status === 'registered' ? $farmer->rsbsa_ref_no : '';
            $barangayName = optional($farmer->barangay)->name ?? 'Unknown Barangay';
            
            return [
                'barangay' => $barangayName,
                'rsbsaRefNo' => $rsbsaRefNo,
                'id' => $farmer->id,
                'farmerName' => $farmer->firstname . ' ' . $farmer->lastname,
                'commodity' => optional($farmer->farms->first())->commodity->name ?? 'No Commodity',
                'allocationType' => $allocationType->name,
                'score' => $scoringDetails['score'],
                'reasons' => $scoringDetails['reasons'],
            ];
        });
        
        $rankedFarmers = $scoredFarmers->sortByDesc('score')->values();
        $currentRank = 1;
        $previousScore = null;

        $rankedFarmers->transform(function ($farmer) use (&$currentRank, &$previousScore) {
            if ($farmer['score'] === $previousScore) {
                $farmer['ranking'] = $currentRank;
            } else if($farmer['score'] > $previousScore) {
                $previousScore = $farmer['score'];
                $farmer['ranking'] = $currentRank;
                $currentRank++;
            }
            return $farmer;
        });

        return response()->json([
            'farmers' => $rankedFarmers,
            'allocationDetails' => $this->getAllocationDetailsParagraph($allocationType),
        ]);
    }

    protected function calculateFarmerScore($farmer, $allocationType)
    {
        $score = 0;
        $reasons = [];

       //make this dynamic later....
        $scoreValues = [
            'PWD' => 5,
            '4Ps' => 3,
            'Senior Citizen' => 5,
            'Registered' => 5,
            'Unregistered' => 2,
            'Crop Damage High' => 10,
            'Crop Damage Medium' => 7,
            'Crop Damage Low' => 4,
            'Commodity Match' => 2,
            'Barangay Match' => 2
        ];
        // Check eligibility criteria and assign score
        if ($farmer->pwd == 'yes') {
            $score += $scoreValues['PWD'];
            $reasons[] = "For being a PWD (+{$scoreValues['PWD']})";
        }
        if ($farmer->{'4ps'} == 'yes') {
            $score += $scoreValues['4Ps'];
            $reasons[] = "For being a 4Ps Beneficiary (+{$scoreValues['4Ps']})";
        }
        if (!empty($farmer->dob) && \Carbon\Carbon::parse($farmer->dob)->age >= 60) {
            $score += $scoreValues['Senior Citizen'];
            $reasons[] = "For being a Senior Citizen (+{$scoreValues['Senior Citizen']})";
        }
        if ($farmer->status == 'registered') {
            $score += $scoreValues['Registered'];
            $reasons[] = "For being a Registered Farmer (+{$scoreValues['Registered']})";
        } elseif ($farmer->status == 'unregistered') {
            $score += $scoreValues['Unregistered'];
            $reasons[] = "For being an Unregistered Farmer (+{$scoreValues['Unregistered']})";
        }
        
        foreach ($farmer->cropDamages as $damage) {
            $severity = $damage->severity; 
            if ($severity == 'high') {
                $score += $scoreValues['Crop Damage High'];
                $reasons[] = "For having experienced an eligible Crop Damage with High Severity (+{$scoreValues['Crop Damage High']})";
            } elseif ($severity == 'medium') {
                $score += $scoreValues['Crop Damage Medium'];
                $reasons[] = "For having experienced an eligible Crop Damage with Medium Severity (+{$scoreValues['Crop Damage Medium']})";
            } else {
                $score += $scoreValues['Crop Damage Low'];
                $reasons[] = "For having experienced an eligible Crop Damage with Low Severity (+{$scoreValues['Crop Damage Low']})";
            }
        }
        
        $farmerCommodity = $farmer->farms->first()?->commodity;
        if ($allocationType->commodities->contains($farmerCommodity)) {
            $score += $scoreValues['Commodity Match'];
            $reasons[] = "For having an eligible commodity ({$farmerCommodity->name}) (+{$scoreValues['Commodity Match']})";
        }

        if ($allocationType->barangays->contains('id', $farmer->brgy_id)) {
            $score += $scoreValues['Barangay Match'];
            $reasons[] = "For residing in eligible barangay (+{$scoreValues['Barangay Match']})";
        }

        return ['score' => $score, 'reasons' => $reasons];
    }

    protected function getAllocationDetailsParagraph($allocationType)
    {
        $eligibilities = array_unique($allocationType->elligibilities->pluck('name')->toArray());
        $barangays = array_unique($allocationType->barangays->pluck('name')->toArray());
        $commodities = array_unique($allocationType->commodities->pluck('name')->toArray());
        $cropDamageCauses = array_unique($allocationType->cropDamageCauses->pluck('name')->toArray());

        return sprintf(
            "The allocation %s is eligible for %s. It is Barangay specific to %s. Commodity specific to %s. And specific to crop damage causes %s.",
            $allocationType->name,
            implode(", ", $eligibilities),
            implode(", ", $barangays),
            implode(", ", $commodities),
            implode(", ", $cropDamageCauses)
        );
    }

    protected function getEligibleFarmers($allocationType)
    {
        // Filter farmers based on allocation criteria
        $eligibilityIds = $allocationType->elligibilities->pluck('id');
        $farmersQuery = Farmer::query();

        if ($eligibilityIds->contains('registered')) {
            $farmersQuery->where('status', 'registered');
        }
        if ($eligibilityIds->contains('unregistered')) {
            $farmersQuery->where('status', 'unregistered');
        }
        if ($eligibilityIds->contains('4ps beneficiary')) {
            $farmersQuery->where('4ps', 'yes');
        }
        if ($eligibilityIds->contains('pwd')) {
            $farmersQuery->where('pwd', 'yes');
        }
        if ($eligibilityIds->contains('senior citizen')) {
            $farmersQuery->whereRaw('TIMESTAMPDIFF(YEAR, dob, CURDATE()) >= 60');
        }

        if ($allocationType->barangays->isNotEmpty()) {
            $barangayIds = $allocationType->barangays->pluck('id');
            $farmersQuery->whereIn('brgy_id', $barangayIds);
        }
        
        if ($allocationType->cropDamageCauses->isNotEmpty()) {
            $damageCauseIds = $allocationType->cropDamageCauses->pluck('id');
            $farmersQuery->whereHas('cropDamages', function ($query) use ($damageCauseIds) {
                $query->whereIn('crop_damage_cause_id', $damageCauseIds);
            });
        }
        
        return $farmersQuery->get();
    }

    public function listAllocationTypesWithDetails(Request $request)
    {
       
        $allocationTypes = AllocationType::with(['commodities', 'elligibilities', 'barangays', 'cropDamageCauses'])->get();

       
        $allocationDetails = $allocationTypes->map(function ($allocationType) {
            return [
                'allocation_type' => $allocationType->name,
                'commodities' => $allocationType->commodities->pluck('name'),
                'elligibilities' => $allocationType->elligibilities->pluck('name'),
                'barangays' => $allocationType->barangays->pluck('name'),
                'crop_damage_causes' => $allocationType->cropDamageCauses->pluck('name'),
            ];
        });

        return response()->json([
            'data' => $allocationDetails,
            'message' => 'Allocation types with related data fetched successfully',
        ]);
    }

    public function listAllocationTypes(Request $request)
    {
        $allocationTypes = AllocationType::all();
        return ($allocationTypes);
    }

}