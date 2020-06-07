import { Frame, FramePoint } from "UI/Frame";

export class OrbView {
    private _instance: Record<number, OrbView> = {};
    private static _boxFrame: Frame;
    private static _orbFrames: { mainButton: Frame, mainImage: Frame, background: Frame, cooldownCounter: Frame, tooltipText: Frame }[] = [];
    private static Config = {
        MaxNodes: 12,
        Size: 0.031,
        BackgroundSize: 0.028,
        X: 0.215, // 0.21
        Y: 0.15, // 0.155
        BoxBackground: "BlueBall.blp",
        NodeBackground: "BlackBall.blp",
    }

    public static get Box() {
        return this._boxFrame;
    }

    public static get Orbs() {
        return this._orbFrames;
    }

    static init() {

        this._boxFrame = new Frame(BlzCreateFrameByType("BACKDROP", "SpellstringBox", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0), "", 0));
        for (let i = 0; i < this.Config.MaxNodes; i++) {

            const orb = this.CreateOrb(i);
            this._orbFrames.push(orb);
        }

        this.Config.Y += this.Config.Size - 0.006;
        this.Config.X -= this.Config.Size * this.Config.MaxNodes - 0.016;

        for (let i = this.Config.MaxNodes; i < this.Config.MaxNodes + 6; i++) {

            const orb = this.CreateOrb(i);
            this._orbFrames.push(orb);
        }
    }

    static CreateOrb(i: number) {
        let xOffset = this.Config.X + i * this.Config.Size;
        let yOffset = this.Config.Y;
        
        let bgFrame = new Frame(BlzCreateFrameByType("BACKDROP", "Background", this._boxFrame.handle, "", 0))
            .SetAbsolutePosition(FramePoint.C, xOffset, yOffset)
            .SetSize(this.Config.BackgroundSize, this.Config.BackgroundSize)
            .SetTexture(this.Config.NodeBackground);
        let mainButtonFrame = new Frame(BlzCreateFrame("ScoreScreenBottomButtonTemplate", this._boxFrame.handle, 0, 0))
            .SetAbsolutePosition(FramePoint.C, xOffset, yOffset)
            .SetSize(this.Config.Size, this.Config.Size)
            .SetVisible(false)
            .SetEnabled(false);
        let mainImageFrame = new Frame(BlzGetFrameByName("ScoreScreenButtonBackdrop", 0))
            .SetTexture(this.Config.BoxBackground);
        let cooldownCounter = new Frame(BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", mainButtonFrame.handle, "StandardInfoTextTemplate",  0))
            .SetAbsolutePosition(FramePoint.C, xOffset, yOffset)
            .SetScale(1.25)
            .SetText("0.0")
            .SetEnabled(false)
            .SetColor(16758842);
        let tooltipFrame = new Frame(BlzCreateFrame("ListBoxWar3", mainButtonFrame.handle, 0, 0))
            .ClearAllPoints()
            .SetAbsolutePosition(FramePoint.BR, 0.81, 0.163)
            .SetSize(0.3, 0.038);
        let tooltipText = new Frame(BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", tooltipFrame.handle, "StandardInfoTextTemplate", 0))
            .SetPosition(FramePoint.TL, tooltipFrame.handle, FramePoint.TL, 0.01, -0.01)
            .SetText("sdijfwseifj wier iwerfh wierjhrtfh")
            .SetScale(1.25);
        BlzFrameSetTooltip(mainButtonFrame.handle, tooltipFrame.handle);
        return { mainButton: mainButtonFrame, mainImage: mainImageFrame, background: bgFrame, cooldownCounter: cooldownCounter, tooltipText: tooltipText };
    }
}