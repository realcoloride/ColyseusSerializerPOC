export function createMapProxy<K, V>(schema: any, propertyName: string, path: (any)[], map: Map<K, V>) {
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

                    if (result instanceof Map) {
                        console.log("nested result:", result, "at path:", path);
                        path.push(args[0]);

                        switch (methodName) {
                            
                            case "get":
                                //target.get();
                                result = createMapProxy(schema, propertyName, path, map);
                                break;
                            case "set":
                                let targetMap: any = target;
                                //console.log(path);
                                path.forEach((key) => {
                                    const map = targetMap.get(key);

                                    if (map instanceof Map) {
                                        console.log("k");
                                        targetMap = targetMap.get(key);
                                        console.log("NEW TARGEt:" , targetMap);
                                    }
                                });


                                targetMap.set(args[0], createMapProxy(schema, propertyName, path, result) as any);
                                break;
                        }
                        //result = createMapProxy(schema, propertyName, map);
                    }

                    return result;
                };
            }

            return Reflect.get(target, property, receiver);
        }
    });
}