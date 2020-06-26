import { Unit } from "w3ts/index";
import { Orders } from "Config";
import { Order } from "Global/Order";

export class AwakenEssence {
    
    public static OrderId = Order.ELEMENTALFURY;
    public static Range = 140;

    public static Check(orderId: number, caster: Unit, x: number, y: number) {
        if (orderId == this.OrderId &&
            (x - caster.x)*(x - caster.x) + (y - caster.y)*(y - caster.y) < AwakenEssence.Range * AwakenEssence.Range
        ) {
            return true;
        }
        return false;
    }
}