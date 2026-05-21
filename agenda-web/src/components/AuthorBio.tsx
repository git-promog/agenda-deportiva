import React from 'react';
import NextImage from 'next/image';
import { ShieldCheck, Share2, Mail } from 'lucide-react';
import Link from 'next/link';
import { EDITORIAL_TEAM } from '@/data/teamData';

interface AuthorBioProps {
  author: {
    name: string;
    role: string;
    bio: string;
    specialty: string;
    avatar?: string;
  };
}

export default function AuthorBio({ author }: AuthorBioProps) {
  const authorId = EDITORIAL_TEAM.find(a => a.name === author.name)?.id || 'redaccion';

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-6 md:p-8 my-12 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-5">
        <ShieldCheck size={120} className="text-blue-500" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
        <Link 
          href={`/autores/${authorId}`} 
          className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 group/avatar block"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl rotate-6 opacity-20 group-hover:rotate-12 transition-transform"></div>
          <div className="relative w-full h-full bg-slate-800 rounded-3xl overflow-hidden border border-slate-700">
            {author.avatar ? (
              <NextImage 
                src={author.avatar} 
                alt={author.name} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 96px, 128px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-500">
                {author.name.charAt(0)}
              </div>
            )}
          </div>
        </Link>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <Link href={`/autores/${authorId}`}>
              <h3 className="text-xl font-black italic uppercase text-white hover:text-blue-500 transition-colors">{author.name}</h3>
            </Link>
            <span className="bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-blue-500/20 flex items-center gap-1">
              <ShieldCheck size={10} /> Verificado
            </span>
          </div>
          
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
            {author.role} • Especialista en <span className="text-blue-500">{author.specialty}</span>
          </p>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {author.bio}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <button className="text-slate-500 hover:text-white transition-colors">
              <Share2 size={18} />
            </button>
            <button className="text-slate-500 hover:text-white transition-colors">
              <Mail size={18} />
            </button>
            <div className="h-4 w-px bg-slate-800 hidden md:block mx-2"></div>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">GuíaSports Editorial Team</span>
          </div>
        </div>
      </div>
    </div>
  );
}
