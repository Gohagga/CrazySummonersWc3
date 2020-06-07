import { SpellEvent } from "Global/SpellEvent";

export class Flamestrike {
    static spellId: number = FourCC("AHfs");

    static init() {
        let t = CreateTrigger();
        SpellEvent.RegisterSpellCast(Flamestrike.spellId, () => {
            print("Flamestrike cast");
        });

        SpellEvent.RegisterSpellEffect(Flamestrike.spellId, () => {
            print("Flamestrike effect");
        });

        SpellEvent.RegisterSpellEnd(Flamestrike.spellId, () => {
            print("Flamestrike end");
        });
    }
}