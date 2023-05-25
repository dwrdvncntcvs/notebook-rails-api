import {
    FC,
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { SignInApiParams, SignUpApiParams } from "../types/api_auth";
import {
    IAuthContext,
    SignInCtxMethod,
    SignUpCtxMethod,
} from "../types/auth_context";
import { signInApi, signUpApi } from "../api/auth";
import { AuthStorage } from "../services";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<IAuthContext>({
    token: "",
    isAuth: false,
    signIn: async (_user: SignInApiParams) => {},
    signUp: async (_userData: SignUpApiParams) => {},
});

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [token, setToken] = useState("");
    const authStorage = new AuthStorage(localStorage);

    const navigate = useNavigate();

    useEffect(() => {
        const authToken = authStorage.getToken();
        console.log("Auth Token: ", authToken);
    }, [token]);

    const signIn: SignInCtxMethod = async (user: SignInApiParams) => {
        try {
            const response = await signInApi(user);
            const token = response.data.token;

            authStorage.saveToken(token);
            setToken(token);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    const signUp: SignUpCtxMethod = async (userData: SignUpApiParams) => {
        try {
            const response = await signUpApi(userData);
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <AuthContext.Provider
            value={{ signIn, token, isAuth: !!token, signUp }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
