export class UnitConfigurable {
    private static _config: Record<number, any>;
    private static _defaultConfig: any;

    public static GetUnitConfig<T>(unit: unit): T {
        const unitId = GetHandleId(unit);
        if (unitId in this._config) {
            return this._config[unitId] as T;
        }
        return this._defaultConfig as T;
    }

    public static UpdateUnitConfig<T>(unit: unit, cb: (config: T) => void) {
        const unitId = GetHandleId(unit);
        let config;
        if (!(unitId in this._config)) {
            config = Object.assign({}, this._defaultConfig) as T;
        } else {
            config = this._config[unitId];
        }
        this._config[unitId] = config;
        cb(this._config[unitId]);
    }

    public static SetDefaultConfig<T>(data: T) {
        this._defaultConfig = data;
        let record: Record<number, T> = {};
        this._config = record;
    }
}
