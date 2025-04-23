import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import axios from 'axios';
import { toast } from 'sonner';

export default function Forget_password({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const [emailSend, setEmailSend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const [password, setPassword] = useState('');
    const [passwordForm, setPasswordForm] = useState(false);
    const [email, setEmail] = useState("");


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const getEmail = formData.get('email') as string;
        setEmail(getEmail);

        if (!getEmail) {
            setLoading(false);
            return;
        }
       
       try {
         const response = await axios.post('/api/forget-password', { email: getEmail });
         if (response.status === 200) {
             console.log('response', response);
             setLoading(false);
             setEmailSend(true);
         } else if (response.status === 500) {
             console.log('response', response);
             toast.error(response.data?.message || "An error occurred");
         }
       } catch (error:any) {
        const errorMessage = error.response?.data.error || "An error occurred";
        toast.error(errorMessage);
        setLoading(false)
        setOpen(false)
    }
    };


    const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          const response = await axios.post('/api/verify-otp', { email, code });
          if (response.status === 200) {
            console.log('response', response);
            setPasswordForm(true);
          }
        } catch (error: any) {
          // Extract error message from the response if available
          const errorMessage =
            error.response?.data || "Wrong OTP or code expired";
          toast.error(errorMessage);
        }
      };
      

    const handleUpdatePassword = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const response = await axios.post('/api/update-password', {email, password});
        if (response.status === 200) {
            console.log('response', response);
            toast.success('passowrd updated successfully');
            setOpen(false);
            }
            else if (response.status === 500) {
                console.log('response', response);
                toast.error(response.data?.message || "An error occurred");
                }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* You can optionally add a trigger button here */}
            </DialogTrigger>
            <DialogContent className="p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#263238]">
                        Forget Password
                    </DialogTitle>
                </DialogHeader>
                {!emailSend && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                        <Label className="text-sm font-medium text-[#263238]">
                            Enter your email address
                        </Label>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            className="border border-[#388E3C] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#388E3C]"
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#388E3C] hover:bg-[#2E7D32] text-white py-2 rounded-md transition-colors"
                        >
                            {loading ? 'sending' : 'Send'}
                        </Button>
                    </form>
                )}
                {emailSend && !passwordForm && (
                    <form onSubmit={handleVerifyCode} className="flex flex-col gap-4 mt-4">
                        <Label className="text-sm font-medium text-[#263238]">
                            Enter the 6-digit code
                        </Label>
                        <Input
                            type="text"
                            name="code"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                            className="text-center tracking-widest text-xl"
                        />
                        <Button
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:opacity-90"
                            type="submit"
                        >
                            Verify
                        </Button>
                    </form>
                )}
                {(emailSend && passwordForm) && (
                    <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 mt-4">
                        <Label className="text-sm font-medium text-[#263238]">
                            Enter your email address
                        </Label>
                        <Input
                            type="password"
                            name="password"
                            onChange={(e)=>setPassword(e.target.value)}
                            placeholder="Enter new Password"
                            className="border border-[#388E3C] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#388E3C]"
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#388E3C] hover:bg-[#2E7D32] text-white py-2 rounded-md transition-colors"
                        >
                            {loading ? 'updating' : 'update'}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
