-- Create enum for game status
CREATE TYPE public.battle_status AS ENUM ('waiting', 'in_progress', 'finished');

-- Create battle rooms table
CREATE TABLE public.battle_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  player2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  player1_name TEXT NOT NULL DEFAULT 'Player 1',
  player2_name TEXT DEFAULT 'Player 2',
  player1_health INTEGER NOT NULL DEFAULT 60,
  player2_health INTEGER NOT NULL DEFAULT 60,
  current_question JSONB,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  status battle_status NOT NULL DEFAULT 'waiting',
  winner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.battle_rooms ENABLE ROW LEVEL SECURITY;

-- RLS policies - allow authenticated users to view and join games
CREATE POLICY "Users can view all battle rooms"
ON public.battle_rooms FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create battle rooms"
ON public.battle_rooms FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Players can update their rooms"
ON public.battle_rooms FOR UPDATE
TO authenticated
USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.battle_rooms;

-- Create timestamp trigger
CREATE OR REPLACE FUNCTION public.update_battle_rooms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_battle_rooms_timestamp
BEFORE UPDATE ON public.battle_rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_battle_rooms_updated_at();