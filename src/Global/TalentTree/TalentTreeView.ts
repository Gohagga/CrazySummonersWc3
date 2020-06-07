import { TalentTree } from "./TalentTree";

type XY = {
    x: number;
    y: number;
}

type FramePosition = {
    p: XY;
    pointSelf: framepointtype;
    pointOther?: framepointtype;
    frameOther?: framehandle;
}

type FrameConfig = {
    clear?: boolean;
    abs?: boolean;
    point?: boolean;
    pos?: FramePosition;
    size?: XY;
    text?: string;
    texture?: string;
}

type TalentFrame = {
    availableImage: framehandle;
    button: framehandle;
    icon: framehandle;
    tooltipBox: framehandle;
    tooltipText: framehandle;
    rankImage: framehandle;
    rankText: framehandle;
    tooltipRank: framehandle;
    onClickTrigger: trigger;
    onClick: () => void;
}

type TalentTreeViewFrames = {
    box: framehandle;
    title: framehandle;
    confirmButton: framehandle;
    confirmText: framehandle;
    cancelButton: framehandle;
    cancelText: framehandle;
    talents: TalentFrame[];
    horizontalLink: framehandle[];
    verticalLink: framehandle[];
}

export class TalentTreeView {
    public static readonly Columns: number = 4;
    public static readonly Rows: number = 7;
    public static readonly Width: number = 0.3;
    public static readonly Height: number = 0.44;
    public static readonly SideMargin: number = 0.1;
    public static readonly VerticalMargin: number = 0.15;

    public static readonly TalentWidth: number = 0.04;
    public static readonly TalentHeight: number = 0.04;
    public static readonly OutlineBorderRatio: number = 0.95;

    public static readonly TooltipBoxWidth: number = 0.28;
    public static readonly TooltipBoxHeight: number = 0.16;

    public static readonly DefaultTalentIconTexture: string = "ReplaceableTextures/CommandButtons/BTNPeasant.blp";
    public static readonly RankIconTexture: string = "UI/Widgets/Console/Human/human-transport-slot.blp";
    public static readonly InactiveLinkTexture: string = "UI/Widgets/Console/Human/human-inventory-slotfiller.blp";
    public static readonly ActiveLinkTexture: string = "Textures/Water00.blp";
    public static readonly AvailableTalentBackgroundTexture: string = "UI/Widgets/Console/Human/CommandButton/human-activebutton.blp";
    public static MaxTalents: number;

    static playerViewedTree: TalentTree[] = [];
    static frames: TalentTreeViewFrames;
    static confirmTrigger: trigger;
    static cancelTrigger: trigger;

    public static RenderForPlayer(player: player) {

        const playerId = GetPlayerId(player);
        if (this.playerViewedTree[playerId] == undefined) return;

        const tt = this.playerViewedTree[playerId];
        const tempState = tt.GetTempRankState();

        if (GetLocalPlayer() == player) {
            for (let i = 0; i < this.MaxTalents; i++) {
                BlzFrameSetVisible(this.frames.horizontalLink[i], false);
                BlzFrameSetVisible(this.frames.verticalLink[i], false);
            }
        }

        for (let i = 0; i < this.MaxTalents; i++) {
            // Fetch the TalentFrame for this index
            const frame = this.frames.talents[i];
            // If talent exists, process it, if not, hide it
            const talent = tt.GetTalent(i)
            if (talent) {
                // Calculatethe Dependencies and Requirements
                let [dep, depString] = tt.CheckDependencies(tempState, i, player);
                let [req, reqString] = talent.Requirements(tt, tt.unit);
                let requirements = "\n|cffff6450Requires: "+depString;
                if (!req)
                    requirements += ", "+reqString;
                requirements += "|r\n\n";

                if (GetLocalPlayer() == player) {
                    BlzFrameSetText(frame.tooltipRank, "Rank "+tempState[i]+"/"+talent.maxRank)
                    // If both dependencies and requirements passed, the button is enabled
                    if (dep && req) {
                        let description = talent.description;
                        if (talent.nextRank && talent.prevRank) description= talent.prevRank.description+"\n\nNext rank:\n"+description;
                        BlzFrameSetText(frame.tooltipText, talent.Name()+"\n\n"+description);
                        if (tt.pointsAvailable > 0) {
                            BlzFrameSetEnable(frame.button, true);
                            BlzFrameSetVisible(frame.availableImage, true);
                        } else {
                            BlzFrameSetEnable(frame.button, false);
                            BlzFrameSetEnable(frame.availableImage, false);
                        }
                    } else {
                        // If either of those failed, update the tooltip with the requirements
                        BlzFrameSetEnable(frame.button, false);
                        BlzFrameSetText(frame.tooltipText, talent.Name()+"\n"+requirements+talent.description);
                        BlzFrameSetVisible(frame.availableImage, false);
                    }

                    // If the Talent is active, but at max rank, disable it
                    if (tempState[i] == talent.maxRank) {
                        BlzFrameSetTexture(frame.icon, talent.icon, 0, true);
                        BlzFrameSetEnable(frame.button, false);
                        BlzFrameSetVisible(frame.availableImage, false);
                        BlzFrameSetText(frame.tooltipText, talent.name+"\n\n"+talent.description);
                    } else if (tempState[i] > 0) {
                        // In case there's a higher lvl of talent but it has some levels
                        // Display it as active and enabled
                        BlzFrameSetTexture(frame.icon, talent.icon, 0, true);
                    } else {
                        // If talent is inactive and has no levels, set it to disabled
                        BlzFrameSetTexture(frame.icon, talent.iconDisabled, 0, true);
                    }

                    // Need to update the level change in the rank counter too
                    if (talent.maxRank > 1) {
                        BlzFrameSetText(frame.rankText, ""+tempState[i])
                        BlzFrameSetVisible(frame.rankText, true)
                        BlzFrameSetVisible(frame.rankImage, true)
                    } else {
                        BlzFrameSetVisible(frame.rankText, false)
                        BlzFrameSetVisible(frame.rankImage, false)
                    }

                    // This hides talent buttons which act as "links"
                    if (!talent.isLink) {
                        BlzFrameSetVisible(frame.button, true)
                    } else {
                        BlzFrameSetVisible(frame.button, false)
                    }
                }
            } else if (GetLocalPlayer() == player) {
                BlzFrameSetVisible(frame.button, false);
                BlzFrameSetVisible(frame.availableImage, false);
            }
        }

        const titleText = tt.title+" ("+tt.pointsAvailable+") points";
        if (GetLocalPlayer() == player) {
            BlzFrameSetText(this.frames.title, titleText)
            BlzFrameSetVisible(this.frames.box, true)
        }
    }

    static OnConfirm() {
        
        const player = GetTriggerPlayer();
        const playerId = GetPlayerId(player);
        if (this.playerViewedTree[playerId] == undefined) return;

        const tt = this.playerViewedTree[playerId];
        tt.SaveTalentRankState();

        if (GetLocalPlayer() == player) {
            BlzFrameSetVisible(this.frames.box, false);
        }
    }

    static OnCancel() {
        
        const player = GetTriggerPlayer();
        const playerId = GetPlayerId(player);
        if (this.playerViewedTree[playerId] == undefined) return;

        const tt = this.playerViewedTree[playerId];
        const tempState = tt.GetTempRankState();
        tt.ResetTempRankState();

        if (GetLocalPlayer() == player) {
            BlzFrameSetVisible(this.frames.box, false)

            BlzFrameSetEnable(this.frames.cancelButton, false)
            BlzFrameSetEnable(this.frames.cancelButton, true)
        }

    }

    static OnClicked(i: number, player: player) {

        const playerId = GetPlayerId(player);
        if (this.playerViewedTree[playerId] == undefined) return;

        const tt = this.playerViewedTree[playerId];
        const tempState = tt.GetTempRankState();
        const talent = tt.GetTalent(i);

        if (tt.pointsAvailable > 0 && tempState[i] < talent.maxRank) {

            tt.ApplyTalentTemporary(i);
            this.RenderForPlayer(player);
        }
    }

    static InitTalentFrame(index: number): TalentFrame {
        const config: Record<string, FrameConfig> = {};
        const tf: Record<string, framehandle> = {};

        if (math.fmod(index, this.Columns) < 3) {
            tf.horizontalLink = BlzCreateFrameByType("BACKDROP", "HorizontalLink", this.frames.box, "", 0)
            this.frames.horizontalLink[index] = tf.horizontalLink
        }
        if (index < (this.MaxTalents - this.Columns)) {
            tf.verticalLink = BlzCreateFrameByType("BACKDROP", "VerticalLink", this.frames.box, "", 0)
            this.frames.verticalLink[index] = tf.verticalLink
        }
        
        tf.availableImage = BlzCreateFrameByType("BACKDROP", "AvailableImg", this.frames.box, "", 0);
        tf.mainButton = BlzCreateFrame("ScoreScreenBottomButtonTemplate", this.frames.box, 0, 0);
        tf.mainImage = BlzGetFrameByName("ScoreScreenButtonBackdrop", 0);
        tf.tooltipBox = BlzCreateFrame("ListBoxWar3", tf.mainButton, 0, 0);
        tf.tooltipText = BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", tf.tooltipBox, "StandardInfoTextTemplate", 0);
        tf.rankImage = BlzCreateFrameByType("BACKDROP", "Counter", tf.mainButton, "", 0);
        tf.rankText = BlzCreateFrameByType("TEXT", "FaceFrameTooltip", tf.mainButton, "", 0);
        tf.tooltipRank = BlzCreateFrameByType("TEXT", "FaceFrameTooltip", tf.tooltipBox, "", 0);

        BlzFrameSetTooltip(tf.mainButton, tf.tooltipBox);
        BlzFrameSetTextAlignment(tf.rankText, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_MIDDLE)
        BlzFrameSetTextAlignment(tf.tooltipRank, TEXT_JUSTIFY_TOP, TEXT_JUSTIFY_RIGHT)

        const xPos = math.floor(math.fmod(index, this.Columns));
        const yPos = math.floor((index) / this.Columns);

        const xIncrem = (this.Width * (1 - this.SideMargin)) / (this.Columns + 1);
        const yIncrem = (this.Height * (1 - this.VerticalMargin)) / (this.Rows + 1);
        const xOffset = xPos * xIncrem - ((this.Columns - 1) * 0.5) * xIncrem;
        const yOffset = yPos * yIncrem - ((this.Rows - 1) * 0.5) * yIncrem;

        config.mainButton = { point: true, pos: { pointSelf: FRAMEPOINT_CENTER, frameOther: this.frames.box, pointOther: FRAMEPOINT_CENTER, p: { x: xOffset, y: yOffset }}, size: { x: this.TalentWidth, y: this.TalentHeight }};
        config.tooltipBox = { point: true, pos: { pointSelf: FRAMEPOINT_TOPLEFT, frameOther: this.frames.box, pointOther: FRAMEPOINT_TOPRIGHT, p: { x: 0.0, y: 0.0 }}, size: { x: this.TooltipBoxWidth, y: this.TooltipBoxHeight }};
        config.tooltipText = { clear: true, point: true, pos: { pointSelf: FRAMEPOINT_CENTER, frameOther: tf.tooltipBox, pointOther: FRAMEPOINT_CENTER, p: { x: 0.0, y: 0.0 }}, size: { x: this.TooltipBoxWidth-0.03, y: this.TooltipBoxHeight-0.03 }, text: "Default talent name \n\nDefault talent description"};
        config.rankImage = { point: true, pos: { pointSelf: FRAMEPOINT_BOTTOMRIGHT, frameOther: tf.mainButton, pointOther: FRAMEPOINT_BOTTOMRIGHT, p: { x: -0.0006, y: 0.0015 }}, size: { x: 0.014, y: 0.014 }, texture: this.RankIconTexture };
        config.rankText = { clear: true, point: true, pos: { pointSelf: FRAMEPOINT_CENTER, frameOther: tf.rankImage, pointOther: FRAMEPOINT_CENTER, p: { x: 0, y: 0 }}, size: { x: 0.01, y: 0.012 }, text: "0"};
        config.verticalLink = { point: true, pos: { pointSelf: FRAMEPOINT_BOTTOM, frameOther: this.frames.box, pointOther: FRAMEPOINT_CENTER, p: { x: xOffset, y: yOffset }}, size: { x: this.TalentWidth*0.10, y: yIncrem }, texture: this.InactiveLinkTexture };
        config.horizontalLink = { point: true, pos: { pointSelf: FRAMEPOINT_LEFT, frameOther: this.frames.box, pointOther: FRAMEPOINT_CENTER, p: { x: xOffset, y: yOffset }}, size: { x: xIncrem, y: this.TalentHeight*0.10 }, texture: this.InactiveLinkTexture };
        config.availableImage = { point: true, pos: { pointSelf: FRAMEPOINT_CENTER, frameOther: tf.mainButton, pointOther: FRAMEPOINT_CENTER, p: { x: 0, y: 0 }}, size: { x: this.TalentWidth*this.OutlineBorderRatio, y: this.TalentHeight*this.OutlineBorderRatio }, texture: this.AvailableTalentBackgroundTexture };
        config.mainImage = { texture: this.DefaultTalentIconTexture };
        config.tooltipRank = { clear: true, point: true, pos: { pointSelf: FRAMEPOINT_TOP, frameOther: tf.tooltipBox, pointOther: FRAMEPOINT_TOP, p: { x: 0.0, y: -0.015 }}, size: { x: this.TooltipBoxWidth-0.03, y: this.TooltipBoxHeight-0.03 }, text: "Rank 1/3"};

        ConfigFrames(config, tf)

        const talentFrame = {
            availableImage: tf.availableImage,
            button: tf.mainButton,
            icon: tf.mainImage,
            tooltipBox: tf.tooltipBox,
            tooltipText: tf.tooltipText,
            rankImage: tf.rankImage,
            rankText: tf.rankText,
            tooltipRank: tf.tooltipRank,
            onClickTrigger: CreateTrigger(),
            onClick: () => {
                const frame = BlzGetTriggerFrame();
                BlzFrameSetEnable(frame, false);
                BlzFrameSetEnable(frame, true);
                this.OnClicked(index, GetTriggerPlayer());
            }
        };

        BlzTriggerRegisterFrameEvent(talentFrame.onClickTrigger, talentFrame.button, FRAMEEVENT_CONTROL_CLICK)
        TriggerAddAction(talentFrame.onClickTrigger, () => talentFrame.onClick());

        return talentFrame;
    }

    static init() {

        const t = CreateTrigger();
        TriggerRegisterTimerEventSingle(t, 0.1)
        TriggerAddAction(t, () => {
            const config: Record<string, FrameConfig> = {};
            const frames: Record<string, framehandle> = {};
            this.MaxTalents = this.Columns * this.Rows;

            frames.box = BlzCreateFrame("SuspendDialog", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0), 0,0);
            config.box = { clear: true, abs: true, pos: { p: { x: 0.35, y: 0.34}, pointSelf: FRAMEPOINT_CENTER }, size: { x: this.Width, y: this.Height }};
            frames.title = BlzGetFrameByName("SuspendTitleText", 0);
            config.title = { text: "Talent Tree" }

            frames.confirmButton = BlzGetFrameByName("SuspendDropPlayersButton", 0);
            config.confirmButton = { clear: true, point: true, pos: { p: { x: 0.0, y: 0.02 }, frameOther: frames.box, pointSelf: FRAMEPOINT_BOTTOMRIGHT, pointOther: FRAMEPOINT_BOTTOM }, size: { x: 0.12, y: 0.03 }};
            frames.confirmText = BlzGetFrameByName("SuspendDropPlayersButtonText", 0);
            config.confirmText = { text: "Confirm" };

            frames.cancelButton = BlzCreateFrame("ScriptDialogButton", frames.box, 0,0)
            config.cancelButton = { clear: true, point: true, pos: { p: { x: 0.0, y: 0.02 }, frameOther: frames.box, pointSelf: FRAMEPOINT_BOTTOMLEFT, pointOther: FRAMEPOINT_BOTTOM }, size: { x: 0.12, y: 0.03 }};
            frames.cancelText = BlzGetFrameByName("ScriptDialogButtonText",0)
            config.cancelText = { text: "Cancel" };

            this.frames = {
                box: frames.box,
                title: frames.title,
                confirmButton: frames.confirmButton,
                confirmText: frames.confirmText,
                cancelButton: frames.cancelButton,
                cancelText: frames.cancelText,
                talents: [],
                horizontalLink: [],
                verticalLink: [],
            }

            // Apply config to created frames
            ConfigFrames(config, frames);

            // Create the talent frames
            for (let i = 0; i < this.MaxTalents; i++) {
                this.frames.talents.push(this.InitTalentFrame(i));
            }

            this.confirmTrigger = CreateTrigger();
            this.cancelTrigger = CreateTrigger();

            // Register the event on the frames
            BlzTriggerRegisterFrameEvent(this.confirmTrigger, frames.confirmButton, FRAMEEVENT_CONTROL_CLICK)
            BlzTriggerRegisterFrameEvent(this.cancelTrigger, frames.cancelButton, FRAMEEVENT_CONTROL_CLICK)

            // Add the trigger Actions
            TriggerAddAction(this.confirmTrigger, () => this.OnConfirm());
            TriggerAddAction(this.cancelTrigger, () => this.OnCancel());
            
            BlzFrameSetVisible(this.frames.box, false)
        })

        const t2 = CreateTrigger();
        TriggerRegisterPlayerChatEvent(t2, Player(0), "-tt", true);
        TriggerAddAction(t2, () => this.RenderForPlayer(Player(0)));
    }

    public static SetPlayerViewedTree(player: player, talentTree: TalentTree) {
        this.playerViewedTree[GetPlayerId(player)] = talentTree;
    }
}

function ConfigFrames(config: Record<string, FrameConfig>, frames: Record<string, framehandle>) {
    
    for (let k in config) {
        let v = config[k];
        if (v.clear) BlzFrameClearAllPoints(frames[k]);
        if (v.size) BlzFrameSetSize(frames[k], v.size.x, v.size.y)
        if (v.pos && v.abs) BlzFrameSetAbsPoint(frames[k], v.pos.pointSelf, v.pos.p.x, v.pos.p.y)
        else if (v.pos && v.point && v.pos.frameOther && v.pos.pointOther)
            BlzFrameSetPoint(frames[k], v.pos.pointSelf, v.pos.frameOther, v.pos.pointOther, v.pos.p.x, v.pos.p.y)
        if (v.text) BlzFrameSetText(frames[k], v.text)
        if (v.texture) BlzFrameSetTexture(frames[k], v.texture, 0, true)
    }
}