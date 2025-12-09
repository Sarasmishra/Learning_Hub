// sLwSnOUS9OaOAOuf
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [tabValue, setTabValue] = useState("login");
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const navigate = useNavigate();
  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  // form submittion
  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    if (
      !inputData.email ||
      !inputData.password ||
      (type === "signup" && !inputData.name)
    ) {
      toast.error("All fields are required");
      return;
    }
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup successful.");
      setTabValue("login");
    }
    if (registerError) {
      toast.error(registerError?.data || "Signup Failed");
    }
    if (loginError) {
      toast.error(loginError.data?.message || "Login Failed");
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful.");
      navigate("/");
    }
  }, [
    loginData,
    loginError,
    loginIsLoading,
    registerIsLoading,
    registerData,
    registerError,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Promo / Brand Panel */}
        <div className="md:col-span-5 hidden md:flex flex-col justify-center gap-6 px-6">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white rounded-3xl p-8 shadow-2xl transform -rotate-1">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Learn. Build. Grow.
            </h1>
            <p className="mt-2 text-slate-100/90">
              A modern LMS experience — streamlined courses, intuitive progress,
              and faster learning paths. Welcome back!
            </p>
          </div>

          <div className="mt-4 bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow">
            <h3 className="text-lg font-semibold">Why you'll love it</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Clean, distraction-free course pages</li>
              <li>• Faster navigation and improved accessibility</li>
              <li>• Mobile-first responsive layouts</li>
            </ul>
          </div>
        </div>

        {/* Form Panel */}
        <div className="md:col-span-7 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center">

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Welcome back
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Sign in to continue to your learning dashboard
              </p>
            </div>

            <div
              className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg overflow-hidden"
              aria-hidden={false}
            >
              <Tabs
                defaultValue="login"
                value={tabValue}
                onValueChange={setTabValue}
              >
                <div className="p-4">
                  <TabsList className="grid grid-cols-2 gap-2 bg-transparent p-1 rounded-xl">
                    <TabsTrigger
                      value="signup"
                      className="rounded-lg py-2 px-3 text-sm font-medium aria-selected:bg-white aria-selected:shadow"
                    >
                      Create account
                    </TabsTrigger>
                    <TabsTrigger
                      value="login"
                      className="rounded-lg py-2 px-3 text-sm font-medium aria-selected:bg-white aria-selected:shadow"
                    >
                      Sign in
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="signup">
                    <Card className="shadow-none">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-lg">Create account</CardTitle>
                        <CardDescription className="text-sm text-slate-500">
                          Start your learning journey — takes less than a minute.
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-4">
                        <div className="space-y-1">
                          <Label htmlFor="name" className="text-sm">
                            Name
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Eg. Saras"
                            name="name"
                            value={signupInput.name}
                            onChange={(e) => changeInputHandler(e, "signup")}
                            required={true}
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="email-signup" className="text-sm">
                            Email
                          </Label>
                          <Input
                            id="email-signup"
                            type="email"
                            name="email"
                            value={signupInput.email}
                            onChange={(e) => changeInputHandler(e, "signup")}
                            placeholder="Eg. saras@gmail.com"
                            required={true}
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="password-signup" className="text-sm">
                            Password
                          </Label>
                          <Input
                            id="password-signup"
                            type="password"
                            name="password"
                            value={signupInput.password}
                            onChange={(e) => changeInputHandler(e, "signup")}
                            placeholder="Create a strong password"
                            required={true}
                            className="h-11"
                          />
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <Button
                          className="w-full py-3"
                          disabled={registerIsLoading}
                          onClick={() => handleRegistration("signup")}
                        >
                          {registerIsLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Please wait
                            </>
                          ) : (
                            "Create account"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="login">
                    <Card className="shadow-none">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-lg">Sign in</CardTitle>
                        <CardDescription className="text-sm text-slate-500">
                          Enter your account details to continue
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-4">
                        <div className="space-y-1">
                          <Label htmlFor="email-login" className="text-sm">
                            Email
                          </Label>
                          <Input
                            id="email-login"
                            type="email"
                            name="email"
                            value={loginInput.email}
                            onChange={(e) => changeInputHandler(e, "login")}
                            placeholder="Eg. saras@gmail.com"
                            required={true}
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="password-login" className="text-sm">
                            Password
                          </Label>
                          <Input
                            id="password-login"
                            required={true}
                            name="password"
                            value={loginInput.password}
                            onChange={(e) => changeInputHandler(e, "login")}
                            placeholder="Your password"
                            type="password"
                            className="h-11"
                          />
                        </div>

                        <div className="flex items-center justify-between text-sm mt-2">
                          <button
                            type="button"
                            className="text-xs text-slate-500 hover:underline"
                            onClick={() => toast("Forgot password flow")}
                          >
                            Forgot password?
                          </button>
                          <div className="text-xs text-slate-500">Need help?</div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <Button
                          className="w-full py-3"
                          disabled={loginIsLoading}
                          onClick={() => handleRegistration("login")}
                        >
                          {loginIsLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Please wait
                            </>
                          ) : (
                            "Sign in"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            <div className="mt-4 text-center text-sm text-slate-500">
              By continuing, you agree to our{" "}
              <a className="text-slate-700 underline">Terms</a> and{" "}
              <a className="text-slate-700 underline">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
