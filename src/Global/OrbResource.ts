// import { Frame, FramePoint } from "UI/Frame";

// export type OrbCost = {
//     Blue: number,
//     White: number,
//     Red: number,
//     Purple: number
// }

// export enum OrbType {
//     Blue,
//     White,
//     Red,
//     Purple
// }

// export class Orb {
//     public type: OrbType;
//     public cooldownRemaining = 0;
//     public isAvailable = true;
//     public enabledTexture = "";
//     public disabledTexture = "";
//     public upgradeId = -1;
//     public static Config = {
//         icon: [
//             Textures.BallBlue,
//             Textures.BallWhite,
//             Textures.BallRed,
//             Textures.BallPurple
//         ],
//         disabled: [
//             Textures.DisBallBlue,
//             Textures.DisBallWhite,
//             Textures.DisBallRed,
//             Textures.DisBallPurple
//         ],
//         upgrade: [
//             Upgrades.BlueOrbs,
//             Upgrades.WhiteOrbs,
//             Upgrades.RedOrbs,
//             Upgrades.PurpleOrbs
//         ]
//     };
//     private timer = CreateTimer();
//     private resourceBar: ResourceBar;

//     constructor(type: OrbType, bar: ResourceBar) {
//         this.type = type;
//         let index = <number>type;
//         this.enabledTexture = Orb.Config.icon[index];
//         this.disabledTexture = Orb.Config.disabled[index];
//         this.upgradeId = Orb.Config.upgrade[index];
//         this.resourceBar = bar;
//     }

//     public Consume(seconds: number) {
//         this.isAvailable = false;
//         this.cooldownRemaining = seconds;
//         BlzDecPlayerTechResearched(this.resourceBar.GetPlayer, this.upgradeId, 1);
//         TimerStart(this.timer, 0.1, true, () => {
//             this.cooldownRemaining -= 0.1;
//             if (this.cooldownRemaining <= 0) {
//                 this.isAvailable = true;
//                 AddPlayerTechResearched(this.resourceBar.GetPlayer, this.upgradeId, 1);
//                 PauseTimer(this.timer);
//             }
//             if (GetLocalPlayer() == this.resourceBar.GetPlayer) {

//                 // TODO: Move into updating a singular referenced OrbView Orb
//                 OrbView.Update(this.resourceBar);
//                 // if (this.isAvailable) {
//                 // }
//             }
//         });
//     }
// }

// export class ResourceBar {
//     private static _instance: Record<number, ResourceBar> = {};
//     private orbs: Orb[] = [];
//     private player: player;

//     constructor(player: player) {
//         this.player = player;
//         const playerId = GetPlayerId(player);
//         ResourceBar._instance[playerId] = this;
//         if (GetLocalPlayer() == player) {
//             OrbView.Box.SetVisible(true);
//         }
//     }

//     public get Orbs() {
//         return this.orbs;
//     }

//     public AddOrb(type: OrbType) {
//         let orb = new Orb(type, this);
//         this.orbs.push(orb);
//         AddPlayerTechResearched(this.player, orb.upgradeId, 1);
//         OrbView.Update(this);
//     }
    
//     public get GetPlayer() {
//         return this.player;
//     }

//     public static Get(player: player) {
//         return this._instance[GetPlayerId(player)];
//     }

//     public Consume(cost: OrbType[] = []) {
//         let usedTypes = [];
//         for (let i = 0; i < this.orbs.length; i++) {
//             usedTypes[i] = this.orbs[i].type;
//         }
//         let usedIndices = [];
//         for (let i = 0; i < cost.length; i++) {
//             // print("i", i);
//             let hasMat = false;
//             // print("Checking for "+<OrbType>cost[i]);
//             for (let j = 0; j < usedTypes.length; j++) {
//                 if (cost[i] == usedTypes[j]) {
//                     // print("Found on index: "+j);
//                     usedTypes[j] = -1;
//                     hasMat = true;
//                     usedIndices.push(j);
//                     break;
//                 }
//             }
//             if (hasMat == false) {
//                 return false;
//             }
//         }
//         for (let index of usedIndices) {
//             this.orbs[index].Consume(10);
//         }
//         return true;
//     }

//     static init() {
//         let bar: ResourceBar;
//         TimerStart(CreateTimer(), 1, false, () => {
//             bar = new ResourceBar(Player(0));
//             bar.AddOrb(OrbType.Purple);
//             bar.AddOrb(OrbType.Purple);
//             bar.AddOrb(OrbType.White);
//             bar.AddOrb(OrbType.White);
//             bar.AddOrb(OrbType.Blue);
//             bar.AddOrb(OrbType.White);
//         });

//         TimerStart(CreateTimer(), 5, false, () => {
//             bar.Consume([OrbType.White, OrbType.White, OrbType.White]);
//         });
//     }
// }

// export class OrbView {
//     private _instance: Record<number, OrbView> = {};
//     private static _boxFrame: Frame;
//     private static _orbFrames: { mainButton: Frame, mainImage: Frame, background: Frame, cooldownCounter: Frame }[] = [];
//     private static Config = {
//         MaxNodes: 10,
//         Size: 0.031,
//         BackgroundSize: 0.028,
//         X: 0.21,
//         Y: 0.155,
//         BoxBackground: "BlueBall.blp",
//         NodeBackground: "BlackBall.blp",
//     }
//     private unit: unit;
//     public static get Box() {
//         return this._boxFrame;
//     }

//     public static get Orbs() {
//         return this._orbFrames;
//     }

//     public static Update(resource: ResourceBar) {
//         const player = resource.GetPlayer;
//         if (GetLocalPlayer() == player) {
//             let index = 0;
//             for (let i = 0; i < resource.Orbs.length; i++) {
//                 index++;
//                 let orb = resource.Orbs[i];
//                 OrbView._orbFrames[i].mainButton.SetVisible(true);
//                 OrbView._orbFrames[i].background.SetVisible(true);

//                 if (orb.isAvailable) {
//                     OrbView._orbFrames[i].mainImage.SetTexture(orb.enabledTexture);
//                     OrbView._orbFrames[i].cooldownCounter.SetVisible(false);
//                     // OrbView._orbFrames[i].mainButton.SetEnabled(true);
//                 } else {
//                     OrbView._orbFrames[i].mainImage.SetTexture(orb.disabledTexture);
//                     OrbView._orbFrames[i].cooldownCounter.SetVisible(true);
//                     OrbView._orbFrames[i].cooldownCounter.SetText(string.format("%.1f", orb.cooldownRemaining));
//                     // OrbView._orbFrames[i].mainButton.SetEnabled(false);
//                 }
//             }
//             for (index; index < this.Config.MaxNodes; index++) {
//                 OrbView._orbFrames[index].mainButton.SetVisible(false);
//                 OrbView._orbFrames[index].background.SetVisible(false);
//             }
//         }
//     }

//     constructor(unit: unit) {
//         this.unit = unit;
//     }
    
//     static init() {

//         this._boxFrame = new Frame(BlzCreateFrameByType("BACKDROP", "SpellstringBox", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0), "", 0));
//         for (let i = 0; i < this.Config.MaxNodes; i++) {

//             const orb = this.CreateOrb(i);
//             this._orbFrames.push(orb);
//         }
//         this._boxFrame.SetVisible(false);
//     }

//     static CreateOrb(i: number) {
//         let xOffset = this.Config.X + i * this.Config.Size;
//         let yOffset = this.Config.Y;
        
//         let bgFrame = new Frame(BlzCreateFrameByType("BACKDROP", "Background", this._boxFrame.handle, "", 0))
//             .SetAbsolutePosition(FramePoint.C, xOffset, yOffset)
//             .SetSize(this.Config.BackgroundSize, this.Config.BackgroundSize)
//             .SetTexture(this.Config.NodeBackground);
//         let mainButtonFrame = new Frame(BlzCreateFrame("ScoreScreenBottomButtonTemplate", this._boxFrame.handle, 0, 0))
//             .SetAbsolutePosition(FramePoint.C, xOffset, yOffset)
//             .SetSize(this.Config.Size, this.Config.Size)
//             .SetVisible(false)
//             .SetEnabled(false);
//         let mainImageFrame = new Frame(BlzGetFrameByName("ScoreScreenButtonBackdrop", 0))
//             .SetTexture(this.Config.BoxBackground);
//         let cooldownCounter = new Frame(BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", mainButtonFrame.handle, "StandardInfoTextTemplate",  0))
//             .SetAbsolutePosition(FramePoint.C, xOffset, yOffset)
//             .SetScale(1.25)
//             .SetText("0.0")
//             .SetColor(16758842);
//         return { mainButton: mainButtonFrame, mainImage: mainImageFrame, background: bgFrame, cooldownCounter: cooldownCounter };
//     }
// }