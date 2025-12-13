# Configuration Supabase - Hearst Qatar

## Configuration initiale

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gnpvwoguufyitnszwvqp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducHZ3b2d1dWZ5aXRuc3p3dnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDI5ODEsImV4cCI6MjA4MTIxODk4MX0.hGQwi6NpZhst0oW3DoTW3ZXxxvLDPP4qoYr-60rbjdk

# Service Role Key (backend only - never expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducHZ3b2d1dWZ5aXRuc3p3dnFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTY0Mjk4MSwiZXhwIjoyMDgxMjE4OTgxfQ.ZuIqOa1m80XMU46p1UzjgxshcLLY6rBGXnfFASgO0bQ

# JWT Secret
SUPABASE_JWT_SECRET=XmWzxdDZK5T98cqc+rcVFHb1fs8C27mxfftYrbsboQLsWL8w60jWj41Rf8rrykJDOjeALzeep0voqaLcdAUh4Q==
```

### 2. Application des migrations SQL

Pour créer les tables dans votre base de données Supabase :

1. Connectez-vous à votre dashboard Supabase : https://gnpvwoguufyitnszwvqp.supabase.co
2. Allez dans **SQL Editor**
3. Exécutez les migrations dans l'ordre :
   - `lib/supabase/migrations/001_initial_schema.sql` - Crée toutes les tables
   - `lib/supabase/migrations/002_row_level_security.sql` - Configure les politiques RLS

### 3. Configuration du Storage

Pour stocker les modèles 3D (fichiers GLB/GLTF) :

1. Dans le dashboard Supabase, allez dans **Storage**
2. Créez un nouveau bucket nommé `3d-models`
3. Configurez les politiques d'accès :
   - **Public** : Lecture pour tous
   - **Authenticated** : Écriture pour les utilisateurs authentifiés

## Structure des fichiers

```
lib/supabase/
├── client.ts              # Client Supabase pour le frontend
├── server.ts              # Client Supabase pour le backend (service role)
├── types.ts               # Types TypeScript (à générer)
├── services/              # Services de données
│   ├── deployments.ts
│   ├── equipment.ts
│   ├── models3d.ts
│   └── ...
└── migrations/            # Scripts SQL de migration
    ├── 001_initial_schema.sql
    └── 002_row_level_security.sql
```

## Utilisation

### Frontend (Client)

```typescript
import { supabase } from '@/lib/supabase/client';

// Exemple : Récupérer les déploiements
const { data, error } = await supabase
  .from('deployments')
  .select('*')
  .eq('user_id', userId);
```

### Backend (Server)

```typescript
import { supabaseAdmin } from '@/lib/supabase/server';

// Exemple : Opération administrative
const { data, error } = await supabaseAdmin
  .from('mining_containers')
  .insert([...]);
```

## Prochaines étapes

1. ✅ Configuration de base (fait)
2. ⏳ Application des migrations SQL
3. ⏳ Création des services de données
4. ⏳ Migration des données depuis localStorage
5. ⏳ Intégration dans l'application

