"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { email, z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"; 
import FormField from "@/components/FormField"; 
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/Firebase/client";
import { sign } from "crypto";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { useState } from "react"; 

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const Authform = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); 
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true); 
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });
        if (!result?.success) {
          toast.error(result?.message);
          return;
        }
        toast.success("Account created successfully.Please Sign-in.");
        router.push("/sign-in");
      } else {
        
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed: Could not get ID token.");
          return;
        }
        
        const result = await signIn({
          email,
          idToken,
        });

        if (result && !result.success) {
          toast.error(result.message || 'Sign in failed on server.');
          return;
        }

        toast.success("Sign-in Successfully.");
        
        router.refresh(); 
      
      }
    } catch (error: any) {
      console.log(error);
      let message = 'There was an error.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      }
      toast.error(message);
    } finally {
      setIsLoading(false); 
    }
  }
  const isSignIn = type === "sign-in";
  return (
    <div className="card-border lg:min-w-[450px]">
      <div className="felx felx-col gap-6 card py-14 px-10">
        <div className="flex justify-center mb-2 gap-2">
          <img src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3 className="text-center">Practice job Interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button className="btn" type="submit" disabled={isLoading}>
              
              {isLoading ? 'Processing...' : (isSignIn ? "Sign-in" : "Create an Account")}
            </Button>
          </form>
        </Form>

        <p className="text-center py-5">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign-in" : "Sign-up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Authform;