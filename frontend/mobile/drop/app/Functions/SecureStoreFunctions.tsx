
import * as SecureStore from "expo-secure-store";



    // Saving a value
    async function save(key:string, value:any) {
        await SecureStore.setItemAsync(key, value);
    }
    

    // Retrieving a value
    async function getValueFor(key:string) {
        let result = await SecureStore.getItemAsync(key);
        if (result) {
            return result;
        } else {
            console.log('No values stored under that key.');
        }
    }


    // Deleting a value
    async function deleteValue(key:string) {
        await SecureStore.deleteItemAsync(key);
    }


    export { deleteValue, getValueFor, save };

