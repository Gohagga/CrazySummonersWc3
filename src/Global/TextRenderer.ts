export class TextRenderer {

    static n = 0;
    
    static readonly keys: Record<string, string> = {
        "c-red": "|cffff8080",
        "c-lightblue": "|cff80ffff",
        "c-accent": "|cffffd9b3",
    }

    static Render(text: string, data: Record<string, string>) {

        let keys = Object.assign({}, this.keys);
        keys = Object.assign(keys, data);

        let result = this.Sub(text, keys);
        return result;
    }

    private static Sub(text: string, keys: Record<string, string>) {

        let [t, count] = string.gsub(text, '{[-%w]*}', (a) => {
            let arg = a.substring(1, a.length - 1);
            return keys[arg];
        });
        return t;
    }
}