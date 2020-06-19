gg_rct_Blue_Damage_Line = nil
gg_rct_Red_Damage_Line = nil
gg_rct_Lane_5 = nil
gg_rct_Lane_4 = nil
gg_rct_Lane_3 = nil
gg_rct_Lane_2 = nil
gg_rct_Lane_1 = nil
gg_rct_Blue_Zone = nil
gg_rct_Red_Zone = nil
gg_rct_Battleground = nil
gg_rct_RedPowerSpawn = nil
gg_rct_Red_Area = nil
gg_rct_Blue_Area = nil
gg_rct_PlayArea = nil
gg_rct_BluePowerSpawn = nil
gg_cam_GameCamera_Red = nil
gg_cam_GameCamera_Blue = nil
gg_cam_GameCameraH1 = nil
gg_cam_GameCameraH2 = nil
gg_trg_Melee_Initialization = nil
gg_trg_After_Start_Copy = nil
gg_unit_h001_0004 = nil
gg_unit_nDUM_0033 = nil
gg_unit_nDUM_0031 = nil
gg_unit_h001_0008 = nil
gg_unit_h002_0009 = nil
gg_unit_h002_0010 = nil
gg_unit_h002_0011 = nil
gg_unit_h002_0012 = nil
gg_unit_h002_0013 = nil
gg_unit_h001_0014 = nil
gg_unit_h001_0015 = nil
gg_unit_e000_0040 = nil
gg_unit_h00L_0019 = nil
gg_unit_h00L_0025 = nil
gg_unit_h001_0006 = nil
gg_unit_e001_0016 = nil
function InitGlobals()
end

function CreateBuildingsForPlayer0()
    local p = Player(0)
    local u
    local unitID
    local t
    local life
    gg_unit_h00L_0019 = BlzCreateUnitWithSkin(p, FourCC("h00L"), -3200.0, -5056.0, 270.000, FourCC("h00L"))
end

function CreateUnitsForPlayer0()
    local p = Player(0)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("nDUM"), -4042.9, -5227.6, 321.129, FourCC("nDUM"))
    u = BlzCreateUnitWithSkin(p, FourCC("nDUM"), -5254.4, -3635.6, 30.323, FourCC("nDUM"))
    u = BlzCreateUnitWithSkin(p, FourCC("nDUM"), -2926.4, -3639.3, 124.402, FourCC("nDUM"))
    u = BlzCreateUnitWithSkin(p, FourCC("nDUM"), -4037.7, -2094.0, 287.060, FourCC("nDUM"))
end

function CreateBuildingsForPlayer1()
    local p = Player(1)
    local u
    local unitID
    local t
    local life
    gg_unit_h00L_0025 = BlzCreateUnitWithSkin(p, FourCC("h00L"), -3264.0, -2240.0, 270.000, FourCC("h00L"))
end

function CreateBuildingsForPlayer5()
    local p = Player(5)
    local u
    local unitID
    local t
    local life
    gg_unit_h001_0004 = BlzCreateUnitWithSkin(p, FourCC("h001"), -3648.0, -4672.0, 270.000, FourCC("h001"))
    SetUnitColor(gg_unit_h001_0004, ConvertPlayerColor(1))
    gg_unit_h001_0006 = BlzCreateUnitWithSkin(p, FourCC("h001"), -4032.0, -4672.0, 270.000, FourCC("h001"))
    SetUnitColor(gg_unit_h001_0006, ConvertPlayerColor(1))
    gg_unit_h001_0008 = BlzCreateUnitWithSkin(p, FourCC("h001"), -4416.0, -4672.0, 270.000, FourCC("h001"))
    SetUnitColor(gg_unit_h001_0008, ConvertPlayerColor(1))
    gg_unit_h001_0014 = BlzCreateUnitWithSkin(p, FourCC("h001"), -4800.0, -4672.0, 270.000, FourCC("h001"))
    SetUnitColor(gg_unit_h001_0014, ConvertPlayerColor(1))
    gg_unit_h001_0015 = BlzCreateUnitWithSkin(p, FourCC("h001"), -3264.0, -4672.0, 270.000, FourCC("h001"))
    SetUnitColor(gg_unit_h001_0015, ConvertPlayerColor(1))
    gg_unit_e000_0040 = BlzCreateUnitWithSkin(p, FourCC("e000"), 5184.0, -5440.0, 270.000, FourCC("e000"))
    SetUnitColor(gg_unit_e000_0040, ConvertPlayerColor(0))
end

function CreateBuildingsForPlayer9()
    local p = Player(9)
    local u
    local unitID
    local t
    local life
    gg_unit_h002_0009 = BlzCreateUnitWithSkin(p, FourCC("h002"), -4800.0, -2624.0, 270.000, FourCC("h002"))
    SetUnitColor(gg_unit_h002_0009, ConvertPlayerColor(1))
    gg_unit_h002_0010 = BlzCreateUnitWithSkin(p, FourCC("h002"), -4416.0, -2624.0, 270.000, FourCC("h002"))
    SetUnitColor(gg_unit_h002_0010, ConvertPlayerColor(1))
    gg_unit_h002_0011 = BlzCreateUnitWithSkin(p, FourCC("h002"), -4032.0, -2624.0, 270.000, FourCC("h002"))
    SetUnitColor(gg_unit_h002_0011, ConvertPlayerColor(1))
    gg_unit_h002_0012 = BlzCreateUnitWithSkin(p, FourCC("h002"), -3648.0, -2624.0, 270.000, FourCC("h002"))
    SetUnitColor(gg_unit_h002_0012, ConvertPlayerColor(1))
    gg_unit_h002_0013 = BlzCreateUnitWithSkin(p, FourCC("h002"), -3264.0, -2624.0, 270.000, FourCC("h002"))
    SetUnitColor(gg_unit_h002_0013, ConvertPlayerColor(1))
    gg_unit_e001_0016 = BlzCreateUnitWithSkin(p, FourCC("e001"), 5184.0, -5632.0, 270.000, FourCC("e001"))
    SetUnitColor(gg_unit_e001_0016, ConvertPlayerColor(1))
end

function CreateUnitsForPlayer9()
    local p = Player(9)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4765.8, -3593.3, 97.089, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4744.3, -3395.2, 3.197, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4475.7, -3603.2, 318.613, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4327.5, -3451.0, 63.723, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3937.1, -3522.9, 181.126, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3990.6, -3405.7, 308.560, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3900.8, -3745.5, 43.694, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3688.7, -3764.4, 353.309, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3531.0, -3671.9, 228.061, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3560.6, -3316.9, 40.167, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3731.6, -3437.2, 170.447, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3707.3, -3516.1, 208.527, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3584.7, -3593.3, 20.248, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3272.1, -3482.0, 92.870, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3198.5, -3529.7, 253.715, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3191.9, -3675.1, 319.657, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3232.0, -3798.8, 353.595, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3510.5, -3923.8, 137.388, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3349.2, -3691.2, 136.927, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3496.4, -3495.7, 216.822, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3264.7, -3251.5, 111.493, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3673.6, -3589.9, 299.584, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3978.5, -3645.9, 1.593, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3939.9, -3826.7, 292.443, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4062.5, -3801.9, 144.497, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4083.1, -3716.9, 155.340, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4088.9, -3589.9, 256.187, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4091.8, -3471.7, 324.183, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4335.6, -3536.4, 358.704, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4287.9, -3606.5, 8.163, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4290.7, -3697.7, 23.588, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4325.9, -3770.7, 227.743, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4409.4, -3826.7, 120.996, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4483.9, -3776.9, 290.169, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4483.3, -3505.9, 213.438, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4477.4, -3391.7, 52.967, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4395.2, -3313.3, 263.768, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4311.7, -3327.7, 214.416, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4116.4, -3377.6, 350.453, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4031.9, -3313.3, 230.544, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3702.0, -3295.3, 61.899, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -3930.7, -3349.2, 107.428, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4817.2, -3451.0, 225.380, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4727.0, -3707.3, 228.413, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4753.6, -3820.5, 320.767, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4887.6, -3262.5, 157.626, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4887.9, -3645.9, 152.022, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4882.4, -3736.0, 184.455, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4867.0, -3826.7, 40.607, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4840.3, -3914.8, 215.932, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4677.5, -3457.9, 69.205, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4651.8, -3342.0, 114.953, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4648.9, -3177.4, 271.448, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4670.4, -3623.0, 273.513, FourCC("hF09"))
    u = BlzCreateUnitWithSkin(p, FourCC("hF09"), -4686.5, -3872.6, 201.495, FourCC("hF09"))
end

function CreateNeutralPassive()
    local p = Player(PLAYER_NEUTRAL_PASSIVE)
    local u
    local unitID
    local t
    local life
    gg_unit_nDUM_0031 = BlzCreateUnitWithSkin(p, FourCC("nDUM"), -4032.5, -4927.3, 175.127, FourCC("nDUM"))
    gg_unit_nDUM_0033 = BlzCreateUnitWithSkin(p, FourCC("nDUM"), -4045.1, -2346.5, 45.177, FourCC("nDUM"))
end

function CreatePlayerBuildings()
    CreateBuildingsForPlayer0()
    CreateBuildingsForPlayer1()
    CreateBuildingsForPlayer5()
    CreateBuildingsForPlayer9()
end

function CreatePlayerUnits()
    CreateUnitsForPlayer0()
    CreateUnitsForPlayer9()
end

function CreateAllUnits()
    CreatePlayerBuildings()
    CreateNeutralPassive()
    CreatePlayerUnits()
end

function CreateRegions()
    local we
    gg_rct_Blue_Damage_Line = Rect(-5184.0, -2784.0, -2880.0, -2560.0)
    gg_rct_Red_Damage_Line = Rect(-5184.0, -4736.0, -2880.0, -4512.0)
    gg_rct_Lane_5 = Rect(-3424.0, -4736.0, -3072.0, -2560.0)
    gg_rct_Lane_4 = Rect(-3808.0, -4736.0, -3488.0, -2560.0)
    gg_rct_Lane_3 = Rect(-4192.0, -4736.0, -3872.0, -2560.0)
    gg_rct_Lane_2 = Rect(-4576.0, -4736.0, -4256.0, -2560.0)
    gg_rct_Lane_1 = Rect(-4992.0, -4736.0, -4640.0, -2560.0)
    gg_rct_Blue_Zone = Rect(-5024.0, -3552.0, -3008.0, -2560.0)
    gg_rct_Red_Zone = Rect(-5024.0, -4736.0, -3008.0, -3552.0)
    gg_rct_Battleground = Rect(-5184.0, -4736.0, -2880.0, -2560.0)
    gg_rct_RedPowerSpawn = Rect(-4928.0, -5280.0, -3328.0, -4768.0)
    gg_rct_Red_Area = Rect(-5024.0, -5440.0, -2976.0, -4736.0)
    gg_rct_Blue_Area = Rect(-5024.0, -2560.0, -2976.0, -1856.0)
    gg_rct_PlayArea = Rect(-5408.0, -5664.0, -2720.0, -1728.0)
    gg_rct_BluePowerSpawn = Rect(-4928.0, -2496.0, -3328.0, -1984.0)
end

function CreateCameras()
    gg_cam_GameCamera_Red = CreateCameraSetup()
    CameraSetupSetField(gg_cam_GameCamera_Red, CAMERA_FIELD_ZOFFSET, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Red, CAMERA_FIELD_ROTATION, 90.3, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Red, CAMERA_FIELD_ANGLE_OF_ATTACK, 307.2, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Red, CAMERA_FIELD_TARGET_DISTANCE, 5178.4, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Red, CAMERA_FIELD_ROLL, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Red, CAMERA_FIELD_FIELD_OF_VIEW, 70.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Red, CAMERA_FIELD_FARZ, 10000.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Red, CAMERA_FIELD_NEARZ, 100.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Red, CAMERA_FIELD_LOCAL_PITCH, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Red, CAMERA_FIELD_LOCAL_YAW, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Red, CAMERA_FIELD_LOCAL_ROLL, 0.0, 0.0)
    CameraSetupSetDestPosition(gg_cam_GameCamera_Red, -4007.1, -3979.5, 0.0)
    gg_cam_GameCamera_Blue = CreateCameraSetup()
    CameraSetupSetField(gg_cam_GameCamera_Blue, CAMERA_FIELD_ZOFFSET, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Blue, CAMERA_FIELD_ROTATION, 270.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Blue, CAMERA_FIELD_ANGLE_OF_ATTACK, 307.2, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Blue, CAMERA_FIELD_TARGET_DISTANCE, 5178.4, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Blue, CAMERA_FIELD_ROLL, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Blue, CAMERA_FIELD_FIELD_OF_VIEW, 70.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Blue, CAMERA_FIELD_FARZ, 10000.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Blue, CAMERA_FIELD_NEARZ, 100.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Blue, CAMERA_FIELD_LOCAL_PITCH, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Blue, CAMERA_FIELD_LOCAL_YAW, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCamera_Blue, CAMERA_FIELD_LOCAL_ROLL, 0.0, 0.0)
    CameraSetupSetDestPosition(gg_cam_GameCamera_Blue, -4057.7, -3338.0, 0.0)
    gg_cam_GameCameraH1 = CreateCameraSetup()
    CameraSetupSetField(gg_cam_GameCameraH1, CAMERA_FIELD_ZOFFSET, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH1, CAMERA_FIELD_ROTATION, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH1, CAMERA_FIELD_ANGLE_OF_ATTACK, 304.1, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH1, CAMERA_FIELD_TARGET_DISTANCE, 3215.4, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH1, CAMERA_FIELD_ROLL, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH1, CAMERA_FIELD_FIELD_OF_VIEW, 70.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH1, CAMERA_FIELD_FARZ, 10000.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH1, CAMERA_FIELD_NEARZ, 100.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH1, CAMERA_FIELD_LOCAL_PITCH, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH1, CAMERA_FIELD_LOCAL_YAW, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH1, CAMERA_FIELD_LOCAL_ROLL, 0.0, 0.0)
    CameraSetupSetDestPosition(gg_cam_GameCameraH1, -4094.9, -3614.5, 0.0)
    gg_cam_GameCameraH2 = CreateCameraSetup()
    CameraSetupSetField(gg_cam_GameCameraH2, CAMERA_FIELD_ZOFFSET, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH2, CAMERA_FIELD_ROTATION, 180.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH2, CAMERA_FIELD_ANGLE_OF_ATTACK, 304.1, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH2, CAMERA_FIELD_TARGET_DISTANCE, 3215.4, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH2, CAMERA_FIELD_ROLL, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH2, CAMERA_FIELD_FIELD_OF_VIEW, 70.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH2, CAMERA_FIELD_FARZ, 10000.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH2, CAMERA_FIELD_NEARZ, 100.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH2, CAMERA_FIELD_LOCAL_PITCH, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH2, CAMERA_FIELD_LOCAL_YAW, 0.0, 0.0)
    CameraSetupSetField(gg_cam_GameCameraH2, CAMERA_FIELD_LOCAL_ROLL, 0.0, 0.0)
    CameraSetupSetDestPosition(gg_cam_GameCameraH2, -3903.4, -3667.5, 0.0)
end

function Trig_Melee_Initialization_Actions()
    MeleeStartingVisibility()
    MeleeStartingAI()
end

function InitTrig_Melee_Initialization()
    gg_trg_Melee_Initialization = CreateTrigger()
    TriggerAddAction(gg_trg_Melee_Initialization, Trig_Melee_Initialization_Actions)
end

function Trig_After_Start_Copy_Actions()
    SetUnitLifePercentBJ(gg_unit_e000_0040, 100)
    SetUnitLifePercentBJ(gg_unit_e001_0016, 100)
    RemoveUnit(gg_unit_nDUM_0031)
    RemoveUnit(gg_unit_nDUM_0033)
    SetUnitLifePercentBJ(gg_unit_h001_0014, 100)
    SetUnitLifePercentBJ(gg_unit_h001_0008, 100)
    SetUnitLifePercentBJ(gg_unit_h001_0006, 100)
    SetUnitLifePercentBJ(gg_unit_h001_0004, 100)
    SetUnitLifePercentBJ(gg_unit_h001_0015, 100)
    SetUnitLifePercentBJ(gg_unit_h002_0009, 100)
    SetUnitLifePercentBJ(gg_unit_h002_0010, 100)
    SetUnitLifePercentBJ(gg_unit_h002_0011, 100)
    SetUnitLifePercentBJ(gg_unit_h002_0012, 100)
    SetUnitLifePercentBJ(gg_unit_h002_0013, 100)
    SetUnitLifePercentBJ(gg_unit_h00L_0019, 100)
    SetUnitLifePercentBJ(gg_unit_h00L_0025, 100)
end

function InitTrig_After_Start_Copy()
    gg_trg_After_Start_Copy = CreateTrigger()
    TriggerRegisterTimerEventSingle(gg_trg_After_Start_Copy, 3.00)
    TriggerAddAction(gg_trg_After_Start_Copy, Trig_After_Start_Copy_Actions)
end

function InitCustomTriggers()
    InitTrig_Melee_Initialization()
    InitTrig_After_Start_Copy()
end

function RunInitializationTriggers()
    ConditionalTriggerExecute(gg_trg_Melee_Initialization)
end

function InitCustomPlayerSlots()
    SetPlayerStartLocation(Player(0), 0)
    ForcePlayerStartLocation(Player(0), 0)
    SetPlayerColor(Player(0), ConvertPlayerColor(0))
    SetPlayerRacePreference(Player(0), RACE_PREF_RANDOM)
    SetPlayerRaceSelectable(Player(0), true)
    SetPlayerController(Player(0), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(1), 1)
    ForcePlayerStartLocation(Player(1), 1)
    SetPlayerColor(Player(1), ConvertPlayerColor(1))
    SetPlayerRacePreference(Player(1), RACE_PREF_RANDOM)
    SetPlayerRaceSelectable(Player(1), true)
    SetPlayerController(Player(1), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(2), 2)
    ForcePlayerStartLocation(Player(2), 2)
    SetPlayerColor(Player(2), ConvertPlayerColor(2))
    SetPlayerRacePreference(Player(2), RACE_PREF_RANDOM)
    SetPlayerRaceSelectable(Player(2), true)
    SetPlayerController(Player(2), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(3), 3)
    ForcePlayerStartLocation(Player(3), 3)
    SetPlayerColor(Player(3), ConvertPlayerColor(3))
    SetPlayerRacePreference(Player(3), RACE_PREF_RANDOM)
    SetPlayerRaceSelectable(Player(3), true)
    SetPlayerController(Player(3), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(4), 4)
    ForcePlayerStartLocation(Player(4), 4)
    SetPlayerColor(Player(4), ConvertPlayerColor(4))
    SetPlayerRacePreference(Player(4), RACE_PREF_RANDOM)
    SetPlayerRaceSelectable(Player(4), true)
    SetPlayerController(Player(4), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(5), 5)
    ForcePlayerStartLocation(Player(5), 5)
    SetPlayerColor(Player(5), ConvertPlayerColor(5))
    SetPlayerRacePreference(Player(5), RACE_PREF_ORC)
    SetPlayerRaceSelectable(Player(5), false)
    SetPlayerController(Player(5), MAP_CONTROL_COMPUTER)
    SetPlayerStartLocation(Player(6), 6)
    ForcePlayerStartLocation(Player(6), 6)
    SetPlayerColor(Player(6), ConvertPlayerColor(6))
    SetPlayerRacePreference(Player(6), RACE_PREF_RANDOM)
    SetPlayerRaceSelectable(Player(6), true)
    SetPlayerController(Player(6), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(9), 7)
    ForcePlayerStartLocation(Player(9), 7)
    SetPlayerColor(Player(9), ConvertPlayerColor(9))
    SetPlayerRacePreference(Player(9), RACE_PREF_ORC)
    SetPlayerRaceSelectable(Player(9), false)
    SetPlayerController(Player(9), MAP_CONTROL_COMPUTER)
end

function InitCustomTeams()
    SetPlayerTeam(Player(0), 0)
    SetPlayerState(Player(0), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(2), 0)
    SetPlayerState(Player(2), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(3), 0)
    SetPlayerState(Player(3), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(5), 0)
    SetPlayerState(Player(5), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(5), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(5), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(5), true)
    SetPlayerAllianceStateVisionBJ(Player(5), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(5), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(5), Player(3), true)
    SetPlayerTeam(Player(1), 1)
    SetPlayerState(Player(1), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(4), 1)
    SetPlayerState(Player(4), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(6), 1)
    SetPlayerState(Player(6), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(9), 1)
    SetPlayerState(Player(9), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(9), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(9), Player(6), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(6), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(9), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(6), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(9), true)
    SetPlayerAllianceStateVisionBJ(Player(6), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(6), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(6), Player(9), true)
    SetPlayerAllianceStateVisionBJ(Player(9), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(9), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(9), Player(6), true)
end

function InitAllyPriorities()
    SetStartLocPrioCount(0, 2)
    SetStartLocPrio(0, 0, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 1, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(1, 2)
    SetStartLocPrio(1, 0, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 1, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(2, 2)
    SetStartLocPrio(2, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 1, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(3, 2)
    SetStartLocPrio(3, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(4, 2)
    SetStartLocPrio(4, 0, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 1, 6, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(6, 2)
    SetStartLocPrio(6, 0, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(6, 1, 4, MAP_LOC_PRIO_HIGH)
end

function main()
    SetCameraBounds(-6144.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), -6144.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 5760.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 5120.0 - GetCameraMargin(CAMERA_MARGIN_TOP), -6144.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 5120.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 5760.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), -6144.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    SetTerrainFogEx(0, 7000.0, 7000.0, 0.500, 0.000, 0.000, 0.000)
    NewSoundEnvironment("Default")
    SetAmbientDaySound("NorthrendDay")
    SetAmbientNightSound("NorthrendNight")
    SetMapMusic("Music", true, 0)
    CreateRegions()
    CreateCameras()
    CreateAllUnits()
    InitBlizzard()
    InitGlobals()
    InitCustomTriggers()
    RunInitializationTriggers()
end

function config()
    SetMapName("TRIGSTR_129")
    SetMapDescription("TRIGSTR_131")
    SetPlayers(8)
    SetTeams(8)
    SetGamePlacement(MAP_PLACEMENT_TEAMS_TOGETHER)
    DefineStartLocation(0, 5184.0, -5568.0)
    DefineStartLocation(1, 5184.0, -5568.0)
    DefineStartLocation(2, 5184.0, -5568.0)
    DefineStartLocation(3, 5184.0, -5568.0)
    DefineStartLocation(4, 5184.0, -5568.0)
    DefineStartLocation(5, 6080.0, -6080.0)
    DefineStartLocation(6, 5184.0, -5568.0)
    DefineStartLocation(7, 6080.0, -6080.0)
    InitCustomPlayerSlots()
    InitCustomTeams()
    InitAllyPriorities()
end

