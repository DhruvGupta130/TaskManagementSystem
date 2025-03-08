import {getTaskUser} from "./api.js";

export async function handleFetchUser(id, user, setError, setUserLoading, setUserDetails) {
    try {
        setUserLoading(true);
        setError("");
        const response = await getTaskUser(id, user?.token);
        setUserDetails(response.data);
        console.log(response.data);
    } catch (err) {
        console.error(err);
        setError("Failed to fetch user details.");
    } finally {
        setUserLoading(false);
    }
}