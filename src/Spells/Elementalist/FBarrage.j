//TESH.scrollpos=3
//TESH.alwaysfold=0
scope FlameBarrage initializer Init
//===========================================================================
//=============================SETUP START===================================
//===========================================================================
    globals
        private constant integer SPELL_ID = 'AE04'  //the rawcode of the spell
        private constant integer DUMMY_ID = 'nDUM'  //rw of the dummy unit
        private constant integer EFFECT_DUMMY_ID = 'hdE4'
        //private constant integer BUFF_ID = 'B00A'  //the rawcode of the spell
        //private constant integer DUMMY_SPELL_ID = 'A018'  //the rawcode of the spell
        private constant string MISSILE_EFFECT = "OrbOfFire.mdx" //"Abilities\\Weapons\\LordofFlameMissile\\LordofFlameMissile.mdl"
		private constant string EXPLOSION_EFFECT = "Abilities\\Spells\\Other\\Incinerate\\FireLordDeathExplode.mdl"
        
        private constant string AOE_EFFECT = "DominationAura.mdl"  //effect that will be created when we cast the spell on the AOE
        //private constant string LIGHTNING_EFFECT = "CHIM"  //effect that will be created when we heal units
        private constant string TARGET_EFFECT = "Abilities\\Spells\\Orc\\LightningBolt\\LightningBoltMissile.mdl"  //effect that will be created when we damage units
        private constant damagetype D_TYPE = DAMAGE_TYPE_NORMAL //the attack type of the spell
        private constant attacktype A_TYPE = ATTACK_TYPE_MAGIC  //the damage type of the spell
        
        // Missile constants
        public constant real MISSILE_SPEED = 500.0
        public constant real LAUNCH_INTERVAL = 1.0
        private constant real ACCELERATION_RATE = 1.04
        private constant real ARC_HEIGHT = 1000.0
        private constant real AOE = 250.0
        
        // Ticks per second
        private constant real FPS = 5
        private constant real PERIOD = 1 / FPS
        
        // Missile specific data variables
        private real array distance[1000]
        private real array travelled[1000]
        private real array angle[1000]
        private real array angleOff[1000]
        private real array barrageX[1000]
        private real array barrageY[1000]
        
        // Spell data constants
        private constant integer = EFF_FREEZE = 'B00E'
        
        // Damage bonus per hp >>>>>>PERCENT<<<<<<< missing
    endglobals
    
    private function Radius takes integer level returns real
        return 250.0
    endfunction
    
    private function Count takes integer level returns integer
        return 3 + (level - 1) / 2 
    endfunction
    
    private function Damage takes integer level returns real
        return 30.0 + 5.0 * level
    endfunction
    
    private function Targets takes unit target returns boolean
    //the units the spell will affect
        return (GetWidgetLife(target) > 0.405) and (IsUnitType(target, UNIT_TYPE_STRUCTURE) == false) and (IsUnitType(target, UNIT_TYPE_MAGIC_IMMUNE) == false) and (IsUnitType(target, UNIT_TYPE_MECHANICAL) == false)
    endfunction
    
    private function RemoveCustomEffects takes unit u returns nothing
        if (GetUnitAbilityLevel(u, EFF_FREEZE) > 0) then
            call UnitRemoveAbility(u, EFF_FREEZE)
        endif
    endfunction
//===========================================================================
//=============================SETUP END=====================================
//===========================================================================  
    private struct Data
        unit caster
        real damage
        real dx = 0.0
        real dy = 0.0
        real buffer = 0.0
        real interval = 0.0
        integer count = 1
        
        static method create takes unit caster, real x, real y, real damage, integer count, real interval returns Data
            local Data d = Data.allocate()
            set d.caster = caster
            set d.damage = damage
            set d.dx = x - GetUnitX(caster)
            set d.dy = y - GetUnitY(caster)
            set d.interval = interval
            set d.buffer = interval
            set d.count = count
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
        private Data array tempData
        private integer index = 0
        private player CurrentPlayer
        private timer tim = CreateTimer()
    endglobals
//=========================================================================== 
//Function made by Blade.dk; Search for [url=http://www.wc3campaigns.com]wc3campaigns.com[/url] for more info   
    private function CopyGroup takes group tempGroup returns group
        set bj_groupAddGroupDest = CreateGroup()
        call ForGroup(tempGroup, function GroupAddGroupEnum)
        return bj_groupAddGroupDest
    endfunction
//===========================================================================
    private function SpellFilter takes nothing returns boolean
        return Targets(GetFilterUnit())
    endfunction
//===========================================================================    
    private function Conditions takes nothing returns boolean
        return GetSpellAbilityId() == SPELL_ID
    endfunction
    
//===========================================================================
    private function FlameBarrageExplode takes Missile fireball returns nothing
        local integer level = EventMissile.level
        local real damage = Damage(level)
        local real radius = AOE
        local unit u
        
        call GroupEnumUnitsInRange(SpellGroup, fireball.x, fireball.y, radius, fireball.hitFilter)			
        loop
            set u = FirstOfGroup(SpellGroup)
            exitwhen u == null
            call GroupRemoveUnit(SpellGroup, u)
            // Damage target
            if (IsUnitAlly(u, GetOwningPlayer(fireball.caster)) == false) then
                if (IsUnitType(u, UNIT_TYPE_HERO) == true) then
                    call UnitDamageTarget(fireball.caster, u, 1, false, false, A_TYPE, D_TYPE, WEAPON_TYPE_WHOKNOWS)
                else
                    call UnitDamageTarget(fireball.caster, u, damage, false, false, A_TYPE, D_TYPE, WEAPON_TYPE_WHOKNOWS)
                endif
            endif
            call RemoveCustomEffects(u)
        endloop
        //call Fireball_TestRangeIndicator(radius, fireball.x, fireball.y)
        call SetUnitScale(fireball.dummy, radius*0.007, radius*0.007, radius*0.007)
        call DestroyEffect(AddSpecialEffectTarget(EXPLOSION_EFFECT, fireball.dummy, "origin"))
    endfunction
//===========================================================================
    private struct FlameBarrageActions extends MissileActions
		method onUnitsHit takes nothing returns boolean
			return true
		endmethod
		
		method onUpdate takes nothing returns boolean
			local real dx
			local real dy
            local integer id = EventMissile.id
            local real progression = travelled[id] / distance[id]
            local real curve = progression - 0.5
            local real cd
            local real cos = Cos(angle[id])
            local real sin = Sin(angle[id])
            set curve = (0.2 - curve * curve)
            
            //call Debug_log("travelled: "+R2S(travelled[id])+", distance: "+R2S(distance[id])+" id "+I2S(id))
			// Move the missile and destroy it if it goes too far.
			if (progression > 1.0) then
                //call Debug_log("OnUpdate: Explode")
                call FlameBarrageExplode(EventMissile)
				return false
			else
                set EventMissile.speed = EventMissile.speed * ACCELERATION_RATE
                
				set dx = EventMissile.speed * cos
				set dy = EventMissile.speed * sin
				
				set barrageX[id] = barrageX[id] + dx
				set barrageY[id] = barrageY[id] + dy
                // Set the new x/y
                set cd = 1500 * curve * angleOff[id]
                //call Debug_log(R2S(cd)+" cd")
                
                set EventMissile.x = barrageX[id] + Cos(angle[id] + bj_PI*0.5) * cd
                set EventMissile.y = barrageY[id] + Sin(angle[id] + bj_PI*0.5) * cd
                //call 
                set EventMissile.z = ARC_HEIGHT*curve*(distance[id]*0.001+1)
                set travelled[id] = travelled[id] + EventMissile.speed
			endif
            return true
		endmethod
                
        method onIndexChange takes integer oldId, integer newId returns nothing
            //call Debug_log("Index changed: "+I2S(oldId)+" into "+I2S(newId))
                    
            set distance[newId] = distance[oldId]
            set travelled[newId] = travelled[oldId]
            set angle[newId] = angle[oldId]
            set angleOff[newId] = angleOff[oldId]
            set barrageX[newId] = barrageX[oldId]
            set barrageY[newId] = barrageY[oldId]
        endmethod
    endstruct
//===========================================================================
    private function ShootFlameBarrage takes unit caster, real tx, real ty returns nothing        
        local real x = GetUnitX(caster)
        local real y = GetUnitY(caster)
        local real z = 40.0

        local real angle = Atan2(ty - y, tx - x)
        local real angleOff = Cos(GetUnitFacing(caster)*bj_DEGTORAD+bj_PI*0.5-angle)
        local integer level = GetUnitAbilityLevel(caster, SPELL_ID)
        
        local Missile m = Missile.create(MISSILE_EFFECT, x, y, z, angle, 0.01, 1.2, FlameBarrageActions.create())
        //call Debug_log("Missile is created")
        set m.level = level
        call m.Fire(caster, b, MISSILE_SPEED)
        set distance[m.id] = SquareRoot((tx-x)*(tx-x)+(ty-y)*(ty-y))
        set travelled[m.id] = 0.0
        set angle[m.id] = angle
        set angleOff[m.id] = angleOff
        set barrageX[m.id] = x
        set barrageY[m.id] = y
        //call Debug_log("offset cos was: "+R2S(angleOff)+" ("+R2S(GetUnitFacing(caster))+")")
        
        set caster = null
    endfunction
//===========================================================================
    private function Update takes nothing returns nothing
        local integer i = 0
        local unit u
        local unit closest = null
        local real closestDistance = 9999.0
        local real distanceNew = 9999.0
        local real x = 0.0
        local real y = 0.0
        local real x1 = 0.0
        local real y1 = 0.0
        local Data d
        
        if (index == 0) then
            return
        endif
        
        loop
            exitwhen i == index
            set d = data[i]
            
            if (d.caster != null and GetWidgetLife(d.caster) > 0.405 and d.count > 0) then
                if (d.buffer >= d.interval) then
                    // TODO: Launch a missile
                    //call Debug_log("Missile launched.")
                    call ShootFlameBarrage(d.caster, d.dx + GetUnitX(d.caster), d.dy + GetUnitY(d.caster))
                    set bj_lastCreatedUnit = CreateUnit(Player(15), EFFECT_DUMMY_ID, d.dx + GetUnitX(d.caster), d.dy + GetUnitY(d.caster), 0.0)
                    call UnitApplyTimedLife(bj_lastCreatedUnit, 'B000', 0.9)
                    call SetUnitScale(bj_lastCreatedUnit, AOE*0.02, AOE*0.02, AOE*0.02)
                    call SetUnitVertexColor(bj_lastCreatedUnit, 255, 255, 255, 160)
                    set d.count = d.count - 1
                    set d.buffer = 0.0
                else
                    set d.buffer = d.buffer + PERIOD
                endif                
            else
                set data[i] = data[index-1]
                set data[index-1] = 0
                set i = i - 1
                set index = index - 1
                call d.destroy()
            endif
            set i = i + 1
        endloop
        call TimerStart(tim, PERIOD, false, function Update)
    endfunction
//===========================================================================
    private function Actions takes nothing returns nothing
        local unit target = GetSpellTargetUnit()
        local unit caster = GetTriggerUnit()
        local real x = GetSpellTargetX()
        local real y = GetSpellTargetY()
        local integer level = GetUnitAbilityLevel(caster, SPELL_ID)
        local unit d = CreateUnit(Player(PLAYER_NEUTRAL_PASSIVE), DUMMY_ID, GetUnitX(target), GetUnitY(target), 0.0)
        
        set data[index] = Data.create(caster, x, y, Damage(level), Count(level), LAUNCH_INTERVAL - 0.15 * (level/2))
        set index = index + 1
        
        call TimerStart(tim, PERIOD, false, function Update)
        set caster = null
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
        call Preload(MISSILE_EFFECT)
        call Preload(EXPLOSION_EFFECT)
        call Preload(AOE_EFFECT)
        call Preload(TARGET_EFFECT)
        
        //preloading the ability
        set bj_lastCreatedUnit = CreateUnit(Player(PLAYER_NEUTRAL_PASSIVE), DUMMY_ID, 0, 0, 0)
        call UnitAddAbility(bj_lastCreatedUnit, SPELL_ID)
        call KillUnit(bj_lastCreatedUnit)
        
    endfunction
endscope