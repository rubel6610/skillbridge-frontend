import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Logo = () => {
    return (
        <div>
              <Link href="/" className="flex items-center gap-2 group">
            <GraduationCap className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SkillBridge
            </span>
          </Link>
        </div>
    );
};

export default Logo;