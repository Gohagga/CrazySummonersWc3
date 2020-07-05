export class FramePoint {
    public static B = FRAMEPOINT_BOTTOM;
    public static BL = FRAMEPOINT_BOTTOMLEFT;
    public static L = FRAMEPOINT_LEFT;
    public static TL = FRAMEPOINT_TOPLEFT;
    public static T = FRAMEPOINT_TOP;
    public static TR = FRAMEPOINT_TOPRIGHT;
    public static R = FRAMEPOINT_RIGHT;
    public static BR = FRAMEPOINT_BOTTOMRIGHT;
    public static C = FRAMEPOINT_CENTER;
}

export class Frame {
    private _frame: framehandle;
    // private 

    constructor(handle: framehandle) {
        this._frame = handle;
    }

    public get handle() {
        return this._frame;
    }

    public SetAbsolutePosition(fp: framepointtype, x: number, y: number) {
        BlzFrameClearAllPoints(this._frame);
        BlzFrameSetAbsPoint(this._frame, fp, x, y);
        return this;
    }

    public ClearAllPoints() {
        BlzFrameClearAllPoints(this._frame);
        return this;
    }

    public SetPosition(fp: framepointtype, relative: framehandle, relativeFp: framepointtype, x: number, y: number) {
        BlzFrameSetPoint(this._frame, fp, relative, relativeFp, x, y);
        return this;
    }

    public SetSize(x: number, y: number) {
        BlzFrameSetSize(this._frame, x, y);
        return this;
    }

    public SetTexture(path: string) {
        BlzFrameSetTexture(this._frame, path, 0, true);
        return this;
    }

    public SetText(text: string) {
        BlzFrameSetText(this._frame, text);
        return this;
    }

    public SetScale(scale: number) {
        BlzFrameSetScale(this._frame, scale);
        return this;
    }

    public SetColor(rgb: number) {
        // let rgb = ((r & 0x0ff) << 16) | ((g & 0x0ff) << 8) | (b & 0x0ff);
        BlzFrameSetVertexColor(this._frame, rgb);
        return this;
    }

    public SetVisible(visible: boolean) {
        BlzFrameSetVisible(this._frame, visible);
        return this;
    }

    public SetEnabled(enabled: boolean) {
        BlzFrameSetEnable(this._frame, enabled);
        return this;
    }

    public OnClick(action: () => void) {
        const t = CreateTrigger();
        BlzTriggerRegisterFrameEvent(t, this._frame, FRAMEEVENT_CONTROL_CLICK);
        TriggerAddAction(t, () => action());
        return this;
    }
}