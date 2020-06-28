//TESH.scrollpos=103
//TESH.alwaysfold=0
scope IonicChannel initializer Init
//===========================================================================
//=============================SETUP START===================================
//===========================================================================
    globals
        private constant integer SPELL_ID = 'AE09'  //the rawcode of the spell
        private constant integer DUMMY_ID = 'nDUM'  //rw of the dummy unit
        private constant integer SPEED_BONUS_SPELL_ID = 'A02N'
        //private constant integer AS_BONUS_SPELL_ID = 'AIs2'
        //private constant integer DMG_BONUS_SPELL_ID = 'A012'
        private constant integer SPELL_ORDER = 852600
        private constant string CASTER_EFFECT = "Abilities\\Spells\\Orc\\FeralSpirit\\feralspirittarget.mdl"  //effect that will be created when we cast the spell on the AOE
        private constant string DAMAGE_EFFECT = "Abilities\\Spells\\Orc\\Purge\\PurgeBuffTarget.mdl"  //effect that will be created when we heal units
        private constant damagetype D_TYPE = DAMAGE_TYPE_NORMAL //the attack type of the spell
        private constant attacktype A_TYPE = ATTACK_TYPE_NORMAL  //the damage type of the spell
        
        // Update per tick, tick is 0.2 seconds
        private constant integer FPS = 5
        private constant real PERIOD = 1.0 / FPS
        
        private constant integer INTERVALS_TO_MAX = 4
        
    endglobals
    
    private function MaxSpeedLvl takes integer level returns integer
        return (level-1)/2 + 3
    endfunction
    
    private function DistancePerLife takes integer level returns real
        return 750.0 - level * 50.0
    endfunction
    
    private function IntervalDuration takes integer level returns integer
        return 9 - ((level - 1)/ 2) * 2
    endfunction
    
//===========================================================================
//=============================SETUP END=====================================
//=========================================================================== 
    private struct Data
        unit caster
        real distancePerLife
        real distanceSum = 0.0
        real prevDistance = -1
        integer interval = 9
        integer laneId = 0
        integer buffer = 0
        integer maxSpeedLvl = 0
        boolean first = false
        
        static method create takes unit caster, integer level, integer laneId returns Data
            local Data d = Data.allocate()
            set d.caster = caster
            set d.distancePerLife = DistancePerLife(level)
            set d.distanceSum = 0.0
            set d.prevDistance = -1.0
            set d.interval = IntervalDuration(level)
            set d.laneId = laneId
            set d.buffer = d.interval - 1
            set d.maxSpeedLvl = MaxSpeedLvl(level)
            set d.first = true
            return d
        endmethod
        
        method onDestroy takes nothing returns nothing
            set .caster = null
        endmethod
    endstruct
//===========================================================================  
    globals
        private boolexpr b
        private Data array data
        private integer Index = 0
        private timer tim = CreateTimer()
    endglobals
//===========================================================================   
    private function SpellFilter takes nothing returns boolean
        return (GetWidgetLife(GetFilterUnit()) > 0.405) and (IsUnitType(GetFilterUnit(), UNIT_TYPE_STRUCTURE) == false) and (IsUnitType(GetFilterUnit(), UNIT_TYPE_MECHANICAL) == false)
    endfunction
//===========================================================================    
    private function Conditions takes nothing returns boolean
        return GetSpellAbilityId() == SPELL_ID
    endfunction
//===========================================================================
    private function Update takes nothing returns nothing
        local integer i = 0
        local integer speedLvl = 0
        local real currentDistance = 0.0
        local integer unitCount = 0
        local unit u
        local Data d
        
        if (Index == 0) then
            return
        endif
        
        loop
            exitwhen i == Index
            set d = data[i]
            set unitCount = 0
            set currentDistance = 0.0
            set speedLvl = 0
            
            if (GetWidgetLife(d.caster) < 0.405 or GetUnitCurrentOrder(d.caster) != SPELL_ORDER) then
                call UnitRemoveAbility(d.caster, SPELL_ID)
                set data[i] = data[Index-1]
                set data[Index-1] = 0
                set i = i - 1
                set Index = Index - 1
                
                call GroupEnumUnitsInRect(SpellGroup, udg_LANE[d.laneId], b)
                loop
                    set u = FirstOfGroup(SpellGroup)
                    exitwhen u == null
                    call GroupRemoveUnit(SpellGroup, u)
                    
                    // If it is an enemy, damage it and add its movement speed
                    if (GetUnitAbilityLevel(u, SPEED_BONUS_SPELL_ID) > 0) then
                        call UnitRemoveAbility(u, SPEED_BONUS_SPELL_ID)
                    endif
                endloop
                
                call d.destroy()
            elseif (d.buffer >= d.interval) then
                call GroupEnumUnitsInRect(SpellGroup, udg_LANE[d.laneId], b)
                //call Debug_log("tick")
                loop
                    set u = FirstOfGroup(SpellGroup)
                    exitwhen u == null
                    call GroupRemoveUnit(SpellGroup, u)
                    set unitCount = unitCount + 1
                    
                    
                    // If it is an enemy, damage it and add its movement speed
                    if (IsUnitAlly(u, GetOwningPlayer(d.caster)) == false) then
                        // DAMAGE TARGET 
                        call UnitDamageTarget(d.caster, u, GetWidgetLife(u)*0.03, false, false, A_TYPE, D_TYPE, WEAPON_TYPE_WHOKNOWS)
                        set currentDistance = currentDistance + RAbsBJ(GetUnitY(udg_MagicCrystalArray[d.laneId])-GetUnitY(u))
                        call DestroyEffect(AddSpecialEffectTarget(DAMAGE_EFFECT, u, "origin"))
                    endif
                    
                    set speedLvl = GetUnitAbilityLevel(u, SPEED_BONUS_SPELL_ID)
                    // If unit has speed ability and it's lower than max, increase it
                    if (speedLvl > 0 and speedLvl < d.maxSpeedLvl) then
                        call SetUnitAbilityLevel(u, SPEED_BONUS_SPELL_ID, speedLvl+1)
                    // Otherwise add it to the target.
                    else
                        call UnitAddAbility(u, SPEED_BONUS_SPELL_ID)
                    endif
                    
                endloop
                call DestroyEffect(AddSpecialEffectTarget(CASTER_EFFECT, d.caster, "origin"))
                set currentDistance = currentDistance / unitCount
                
                // GIVE LIFE BASED ON PREVIOUS DISTANCE
                if (d.first != true) then
                    set d.distanceSum = d.distanceSum + d.prevDistance - currentDistance
                    //call Debug_log("prev distance: "+R2S(d.prevDistance)+" current distance: " + R2S(currentDistance)+" distanceSum: "+R2S(d.distanceSum))
                    set d.prevDistance = currentDistance
                else
                    set d.prevDistance = currentDistance
                    set d.first = false
                endif
                if (d.distanceSum > d.distancePerLife) then
                    call SetWidgetLife(d.caster, GetWidgetLife(d.caster) + R2I(d.distanceSum / d.distancePerLife))
                    set d.distanceSum = d.distanceSum - d.distancePerLife
                    call Debug_log("Healed")
                endif
                set d.buffer = 0
            else
                set d.buffer = d.buffer + 1
                //call Debug_log(I2S(d.buffer))
            endif
            set i = i + 1
        endloop
        call TimerStart(tim, PERIOD, false, function Update)
    endfunction
//===========================================================================
    private function Actions takes nothing returns nothing
        local unit caster = GetTriggerUnit()
        local player owner = GetOwningPlayer(caster)
        local integer level = GetUnitAbilityLevel(caster, SPELL_ID)
        
        if (GetWidgetLife(caster) >= 1) then
            set data[Index] = Data.create(udg_Hero[GetPlayerId(owner)], level, HELPERS_GetSpellTargetedMagicCrystalIndex())
            set Index = Index + 1
            call TimerStart(tim, PERIOD, false, function Update)
        endif        
        
        //call Debug_log("Ionic Channel cast: "+R2S(data[Index].prevDistance))
        set caster = null
        set owner = null
    endfunction    
//===========================================================================
    private function Init takes nothing returns nothing
        local trigger InstantJusticeTrg = CreateTrigger()
        call TriggerRegisterAnyUnitEventBJ(InstantJusticeTrg, EVENT_PLAYER_UNIT_SPELL_EFFECT )
        call TriggerAddCondition(InstantJusticeTrg, Condition( function Conditions ) )
        call TriggerAddAction( InstantJusticeTrg, function Actions )
        
        //setting globals
        set b = Condition(function SpellFilter)
        
        //preloading effects
        call Preload(CASTER_EFFECT)
        call Preload(DAMAGE_EFFECT)
        
        //preloading the ability
        set bj_lastCreatedUnit = CreateUnit(Player(PLAYER_NEUTRAL_PASSIVE), DUMMY_ID, 0, 0, 0)
        call UnitAddAbility(bj_lastCreatedUnit, SPELL_ID)
        call UnitAddAbility(bj_lastCreatedUnit, SPEED_BONUS_SPELL_ID)
        call KillUnit(bj_lastCreatedUnit)
        
    endfunction
endscope
