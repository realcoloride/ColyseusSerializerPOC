import { isRecord } from "./record";
import { createProxySetter } from "./schema";

export function createMapProxy<K, V>(
    schema: any, 
    values: Map<object, Map<string, any>>,
    initialized: Map<object, Set<string>>,
    propertyName: string, 
    path: (any)[], 
    map: Map<K, V>,
    multiplePath: (any)[]
) {
    return new Proxy(map, {
        get(target, property, receiver) {
            if (typeof target[property as keyof typeof target] === 'function') {
                return (...args: any[]) => {
                    const methodName = String(property);
                    console.log(`Method at path [${[...path].join('][')}] ${methodName} called with arguments: ${args}`);
                    
                    let result = ((target as any)[property as keyof any[]] as Function).apply(target, args);
                    /*const encodeIndex = schema?.__propertyToIndex[propertyName];
                    schema?.__operationManager.encodeSetMethod(encodeIndex, String(property), args);*/
                    console.log(result);

                    
                    switch (methodName) {
                                
                        case "get":
                            if (result instanceof Array ||
                                isRecord(result)
                            ) {
                                console.log("is inside of something?");
                                multiplePath.push(property);
                            } 
                            console.log("m", multiplePath);
                            //target.get();
                            //createProxySetter(propertyName, values, initialized, path, multiplePath).call(this, result);
                            //result = createProxySetter.call(schema, propertyName, values, initialized, path, multiplePath, result);
                            console.log("r", result);
                            break;
                        case "set":
                            /*let targetMap: any = target;
                            //console.log(path);
                            path.forEach((key) => {
                                const map = targetMap.get(key);

                                if (map instanceof Map) {
                                    console.log("k");
                                    targetMap = targetMap.get(key);
                                    console.log("NEW TARGEt:" , targetMap);
                                }
                            });


                            targetMap.set(args[0], createMapProxy(schema, propertyName, path, result) as any);*/
                            break;
                    }
                    
                    if (!(result instanceof Proxy)) {
                    }

                    if (result instanceof Map) {
                        console.log("nested result:", result, "at path:", path);
                        path.push(args[0]);

                        //result = createMapProxy(schema, propertyName, map);
                    }

                    return result;
                };
            }

            return Reflect.get(target, property, receiver);
        }
    });
}