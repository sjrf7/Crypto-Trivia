
'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Award, BrainCircuit, Gamepad2, Trophy, Wand2, User, Swords } from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <motion.div
    className="bg-card p-6 rounded-lg border flex flex-col items-center text-center"
    variants={itemVariants}
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="bg-primary/10 p-4 rounded-full mb-4">
      <Icon className="h-8 w-8 text-primary drop-shadow-glow-primary" />
    </div>
    <h3 className="text-xl font-headline mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

export default function WelcomePage() {
  return (
    <motion.div
      className="container mx-auto px-4 py-8 text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 10 }}
      >
        <Trophy className="h-16 w-16 text-primary drop-shadow-glow-primary" />
      </motion.div>

      <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-headline font-bold mb-4">
        Crypto Trivia Showdown
      </motion.h1>

      <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
        Pon a prueba tus conocimientos sobre criptomonedas, compite contra otros, y genera tus propias trivias con el poder de la IA.
      </motion.p>

      <motion.div variants={itemVariants} className="mb-12">
        <Button asChild size="lg" className="text-lg font-bold">
          <Link href="/play" prefetch={true}>
            <Gamepad2 className="mr-2 h-6 w-6" />
            Entrar al Juego
          </Link>
        </Button>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <FeatureCard
          icon={Wand2}
          title="Trivia con IA"
          description="Genera cuestionarios únicos sobre cualquier tema de cripto, blockchain o web3 al instante."
        />
        <FeatureCard
          icon={BrainCircuit}
          title="Modo Clásico"
          description="Enfréntate a nuestras preguntas clásicas y demuestra que eres un experto."
        />
        <FeatureCard
          icon={Trophy}
          title="Tablas de Clasificación"
          description="Compite por el primer puesto y mira cómo te posicionas frente a los mejores."
        />
        <FeatureCard
          icon={Award}
          title="Logros y Recompensas"
          description="Desbloquea logros por tus hitos y muéstralos en tu perfil."
        />
         <FeatureCard
          icon={User}
          title="Perfil de Farcaster"
          description="Inicia sesión con Farcaster para guardar tu progreso y personalizar tu perfil."
        />
         <FeatureCard
          icon={Swords}
          title="Desafíos"
          description="Reta a tus amigos a superar tu puntuación con las mismas preguntas."
        />
      </motion.div>
    </motion.div>
  );
}
