
import React from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({ 
  value, 
  onChange, 
  length = 6
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4">
        <InputOTP 
          value={value} 
          onChange={onChange} 
          maxLength={length}
        >
          <InputOTPGroup>
            {Array.from({ length }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <p className="text-sm text-muted-foreground">
        For this demo, use code: <span className="font-medium">123456</span>
      </p>
    </div>
  );
};
