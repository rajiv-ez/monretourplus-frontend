# Lancement du projet :
- Vérifier que le **.env** est bien conforme aux attentes du **.env.example**
- Ensuite:
```bash
npm i
npm run dev
```

# En cas de modifications coté frontend: 
- D'abord, s'assurer que le **VITE_API_BASE_URL** dans le fichier **.env** contient bien l'url de prod et non celle de dev. 
Puis :
```bash
npm run build
```
- les fichiers obtenus dans le **frontend/dist** devront etre utilsé coté backend, selon les intructions du **backend/README.md**