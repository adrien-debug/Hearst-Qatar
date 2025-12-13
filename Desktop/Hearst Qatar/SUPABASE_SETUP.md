# Guide de Configuration Supabase - Hearst Qatar

## ✅ Étape 1 : Créer le fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :

```env
NEXT_PUBLIC_SUPABASE_URL=https://gnpvwoguufyitnszwvqp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducHZ3b2d1dWZ5aXRuc3p3dnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDI5ODEsImV4cCI6MjA4MTIxODk4MX0.hGQwi6NpZhst0oW3DoTW3ZXxxvLDPP4qoYr-60rbjdk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducHZ3b2d1dWZ5aXRuc3p3dnFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTY0Mjk4MSwiZXhwIjoyMDgxMjE4OTgxfQ.ZuIqOa1m80XMU46p1UzjgxshcLLY6rBGXnfFASgO0bQ
SUPABASE_JWT_SECRET=XmWzxdDZK5T98cqc+rcVFHb1fs8C27mxfftYrbsboQLsWL8w60jWj41Rf8rrykJDOjeALzeep0voqaLcdAUh4Q==
```

## ✅ Étape 2 : Appliquer les migrations SQL

1. Ouvrez votre dashboard Supabase : https://gnpvwoguufyitnszwvqp.supabase.co
2. Allez dans **SQL Editor** (menu de gauche)
3. Copiez-collez le contenu de `lib/supabase/migrations/001_initial_schema.sql`
4. Cliquez sur **Run** pour exécuter la migration
5. Répétez avec `lib/supabase/migrations/002_row_level_security.sql`

## ✅ Étape 3 : Configurer le Storage pour les modèles 3D

1. Dans le dashboard Supabase, allez dans **Storage**
2. Cliquez sur **New bucket**
3. Nom : `3d-models`
4. Public bucket : **Activé** (pour permettre l'accès public aux modèles)
5. Cliquez sur **Create bucket**

### Configurer les politiques de Storage

1. Cliquez sur le bucket `3d-models`
2. Allez dans l'onglet **Policies**
3. Créez une politique pour la lecture publique :

```sql
-- Policy: Public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = '3d-models');
```

4. Créez une politique pour l'écriture authentifiée :

```sql
-- Policy: Authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = '3d-models');
```

## ✅ Étape 4 : Vérifier la connexion

Redémarrez votre serveur de développement :

```bash
npm run dev
```

Vérifiez qu'il n'y a pas d'erreurs dans la console concernant Supabase.

## 📋 Checklist de configuration

- [ ] Fichier `.env.local` créé avec les bonnes variables
- [ ] Migration `001_initial_schema.sql` exécutée
- [ ] Migration `002_row_level_security.sql` exécutée
- [ ] Bucket `3d-models` créé dans Storage
- [ ] Politiques de Storage configurées
- [ ] Serveur redémarré sans erreurs

## 🔍 Vérification

Pour tester la connexion, vous pouvez créer un fichier de test temporaire :

```typescript
// test-supabase.ts (à supprimer après test)
import { supabase } from './lib/supabase/client';

async function testConnection() {
  const { data, error } = await supabase.from('deployments').select('count');
  console.log('Supabase connection:', error ? '❌ Error' : '✅ OK');
  if (error) console.error(error);
}

testConnection();
```

## 📚 Documentation

Pour plus d'informations, consultez :
- `lib/supabase/README.md` - Documentation détaillée
- [Documentation Supabase](https://supabase.com/docs)

