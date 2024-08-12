import 'reflect-metadata';

import { sync, Schema } from './schema';
import { isRecord } from './record';

class MySchema extends Schema {
    @sync()
    eatGood = "";

    @sync()
    drinkWell = "";

    @sync()
    liquids: string[] = ["water"];

    @sync()
    dimensions: string[][][][] = [];

    @sync()
    coolSet: Set<string> = new Set();

    @sync()
    myMap: Map<string, Map<string, Map<string, Map<string, Map<string, number>>>>> = new Map();

    @sync()
    nestedMap: Map<string, any[]> = new Map();

    @sync()
    myRecord: Record<string, number> = {};

    @sync()
    myObject: any = {};

    @sync()
    iHateThis: Map<string, any[][]> = new Map();

    //@sync()
    //schemaInASchema: MySchema = new MySchema();
}


const schema = new MySchema();
schema.eatGood = "hello world";
schema.drinkWell = "cheers";

schema.liquids.push("soda");
schema.eatGood = "do not eat good!!";
schema.dimensions[0] = [];
//schema.dimensions[0][0] = [];
schema.dimensions[0][0] = [["forza horizon", "cheese", "yay", "hello world?"]];
schema.dimensions[0][0][0] = ["forza gorizon", "thingy"];
schema.dimensions[0][0][0].push("hmm pizza", "hmm ravioli");

schema.coolSet.add("cool thing numero uno");
schema.coolSet.delete("cool thing numero uno");
schema.coolSet.add("cool thing numero uno");
schema.coolSet.clear();
schema.coolSet = new Set("z");

// THIS IS MONSTRUOUS
schema.myMap.set("test", new Map<string, Map<string, Map<string, Map<string, number>>>>());
schema.myMap.get("test")?.set("test", new Map<string, Map<string, Map<string, number>>>());
schema.myMap.get("test")?.get("test")?.set("test", new Map<string, Map<string, number>>());
schema.myMap.get("test")?.get("test")?.get("test")?.set("test", new Map<string, number>());
schema.myMap.get("test")?.get("test")?.get("test")?.get("test")?.set("test", 45);
//schema.myMap.get("test")?.get("test")?.get("test")?.get("test")?.get("test")?..set("test", new Map<string, Map<string, Map<string, number>>>());

//schema.myMap.get("test")?.set("test", 5);
console.log(schema.myMap);
console.log("ya", schema.myMap.get("test")?.get("test")?.get("test")?.get("test")?.get("test"));

// this causes a nasty stack overflow lel
//schema.schemaInASchema.coolSet = new Set();
schema.nestedMap.set("test", [47]);

const array2 = schema.nestedMap.get("test") as any[];
array2[1] = 1;
console.log("m", array2);

console.log(schema.nestedMap.get("test"));
schema.iHateThis.set("test", []);
const array = schema.iHateThis.get("test") as any[];
console.log("m", array);
array[0] = 1;
console.log(schema.nestedMap.get("test"));

/*
console.log();
schema.myRecord["whaaaat"] = 2;*/
// ["test"], [0]

//console.log(schema);
