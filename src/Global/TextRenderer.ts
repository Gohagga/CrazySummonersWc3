import { Log } from "Config";

export class TextRenderer {

    static n = 0;
    
    static readonly keys: Record<string, string> = {
        "c-r": "|cffff8080",
        "c-lb": "|cff80ffff",
        "c-acc": "|cffffd9b3",
        "c-b": "|cff8a8aff",
        "c-chill": "|cff00cac5",
    }

    static Render(text: string, data: Record<string, string>) {

        let keys = Object.assign({}, this.keys);
        keys = Object.assign(keys, data);
        
        try {
            let result = this.Sub(text, keys);
            return result;
        } catch (e) {
            Log.info(e);
            return e;
        }
    }

    private static Sub(text: string, keys: Record<string, string>) {

        let [t, count] = string.gsub(text, '{[-%w]*}', (a) => {
            let arg = a.substring(1, a.length - 1);
            return keys[arg];
        });
        return t;
    }
}