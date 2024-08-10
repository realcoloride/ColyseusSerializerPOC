import { isRecord } from "./record";
import { createProxySetter } from "./schema";
import { Operation } from './enums';

export function createMapProxy<K, V>(
    schema: any, 
    values: Map<object, Map<string, any>>,
    initialized: Map<object, Set<string>>,
    propertyName: string, 
    path: any[], 
    map: Map<K, V>,
    multiplePath: any[]
) {
    return new Proxy(map, {
        get(target, property, receiver) {
            if (typeof target[property as keyof typeof target] === 'function') {
                const methodName = String(property);
                return (...args: any[]) => {
                    let result = (target[property as keyof typeof target] as Function).apply(target, args);
                    
                    if (methodName === "get") {
                        const key = args[0];

                        if (result instanceof Array) {
                            // When the result is an array, prioritize the `path` for array operations
                            path.push(key);
                        } else if (result instanceof Map || isRecord(result) || result instanceof Set) {
                            // When result is a Map, Record, or Set, continue using `multiplePath`
                            multiplePath.push(key);
                            result = createProxySetter.call(schema, propertyName, values, initialized, path, multiplePath, result);
                        }
                    }

                    return result;
                };
            }

            return Reflect.get(target, property, receiver);
        },

        set(target, property, value, receiver) {
            if (value instanceof Array) {
                // Prioritize `path` for arrays
                path.push(property);
            } else {
                // For nested maps or records, continue using `multiplePath`
                multiplePath.push(property);
            }
            
            createProxySetter.call(schema, propertyName, values, initialized, path, multiplePath, value);
            return Reflect.set(target, property, value, receiver);
        }
    });
}
