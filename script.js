// Gestion du modal
const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const closeModal = document.getElementById('closeModal');
const authModal = document.getElementById('authModal');
const authBtn = document.getElementById('authBtn');
const logoutBtn = document.getElementById('logoutBtn');
const profileBtn = document.getElementById('profileBtn');
const closeAuthModal = document.getElementById('closeAuthModal');

infoBtn.addEventListener('click', () => {
    infoModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    infoModal.classList.add('hidden');
});

authBtn.addEventListener('click', () => {
    authModal.classList.remove('hidden');
});

closeAuthModal.addEventListener('click', () => {
    authModal.classList.add('hidden');
});

logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut();
});

// Auth state listener
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        // User is logged in
        authBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        profileBtn.classList.remove('hidden');
        authModal.classList.add('hidden');

        // Load user profile
        try {
            const doc = await db.collection('profiles').doc(user.uid).get();
            if (doc.exists) {
                const savedProfile = doc.data();
                document.getElementById('age').value = savedProfile.age;
                document.getElementById('weight').value = savedProfile.weight;
                document.getElementById('height').value = savedProfile.height;
                document.getElementById('activity').value = savedProfile.activity;
                document.getElementById('goal').value = savedProfile.goal;

                const genderInputs = document.querySelectorAll('input[name="gender"]');
                genderInputs.forEach(input => {
                    input.checked = input.value === savedProfile.gender;
                });
            }
        } catch (error) {
            console.error("Error getting user profile: ", error);
        }
    } else {
        // User is logged out
        authBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        profileBtn.classList.add('hidden');
    }
});

// Login form
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['loginEmail'].value;
    const password = loginForm['loginPassword'].value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(err => {
            console.error(err);
            alert(err.message);
        });
});

// Register form
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = registerForm['registerFirstName'].value;
    const lastName = registerForm['registerLastName'].value;
    const email = registerForm['registerEmail'].value;
    const password = registerForm['registerPassword'].value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(cred => {
            return db.collection('profiles').doc(cred.user.uid).set({
                firstName: firstName,
                lastName: lastName,
                age: null,
                weight: null,
                height: null,
                activity: null,
                goal: null,
                gender: null
            });
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        });
});


//contenu de la base de données
const menusDatabase = {
    maintain: {
        breakfast: [
            {
                title: "Porridge protéiné",
                calories: 350,
                description: "Flocons d'avoine, lait d'amande, banane, noix et graines",
                nutrients: "P : 15 g, G : 50 g, L : 10 g"
            },
            {
                title: "Omelette aux légumes",
                calories: 400,
                description: "Oeufs, épinards, tomates, fromage de chèvre, pain complet",
                nutrients: "P : 25 g, G : 30 g, L : 18 g"
            },
            {
                title: "Toast ricotta et miel",
                calories: 380,
                description: "Pain complet, ricotta, miel, graines de lin",
                nutrients: "P : 18 g, G : 45 g, L : 12 g"
            },
            {
                title: "Bol muesli et fruits",
                calories: 420,
                description: "Muesli, lait végétal, fruits frais, amandes",
                nutrients: "P : 20 g, G : 55 g, L : 15 g"
            }
        ],
        lunch: [
            {
                title: "Poulet et quinoa",
                calories: 550,
                description: "Filet de poulet grillé, quinoa, brocolis vapeur, avocat",
                nutrients: "P : 40 g, G : 45 g, L : 20 g"
            },
            {
                title: "Salade de saumon",
                calories: 500,
                description: "Saumon grillé, mélange de salades, quinoa, tomates cerises, vinaigrette légère",
                nutrients: "P : 35 g, G : 30 g, L : 25 g"
            },
            {
                title: "Buddha bowl végétarien",
                calories: 480,
                description: "Pois chiches, patate douce, avocat, quinoa, choux rouge",
                nutrients: "P : 22 g, G : 55 g, L : 18 g"
            },
            {
                title: "Tacos de poisson",
                calories: 520,
                description: "Poisson blanc grillé, tortillas complètes, salade, avocat, sauce légère",
                nutrients: "P : 30 g, G : 40 g, L : 22 g"
            }
        ],
        snack: [
            {
                title: "Smoothie vert",
                calories: 250,
                description: "Épinards, banane, lait d'amande, protéine en poudre",
                nutrients: "P : 20 g, G : 30 g, L : 5 g"
            },
            {
                title: "Yaourt et fruits secs",
                calories: 200,
                description: "Yaourt grec nature, amandes, noix, miel",
                nutrients: "P : 15 g, G : 15 g, L : 10 g"
            },
            {
                title: "Muffin aux flocons d'avoine",
                calories: 220,
                description: "Flocons d’avoine, compote de pommes, oeufs, dattes",
                nutrients: "P : 10 g, G : 25 g, L : 8 g"
            },
            {
                title: "Pomme et beurre d’amande",
                calories: 180,
                description: "Tranches de pomme avec beurre d’amande",
                nutrients: "P : 5 g, G : 20 g, L : 8 g"
            }
        ],
        dinner: [
            {
                title: "Dahl de lentilles",
                calories: 450,
                description: "Lentilles corail, lait de coco, épices, riz basmati",
                nutrients: "P : 25 g, G : 60 g, L : 12 g"
            },
            {
                title: "Filet de blanc de dinde",
                calories: 400,
                description: "Blanc de dinde, purée de patate douce, haricots verts",
                nutrients: "P : 35 g, G : 40 g, L : 10 g"
            },
            {
                title: "Riz sauté aux crevettes",
                calories: 480,
                description: "Riz complet, crevettes, petits pois, carottes, sauce soja légère",
                nutrients: "P : 30 g, G : 50 g, L : 15 g"
            },
            {
                title: "Gratin de légumes au tofu",
                calories: 430,
                description: "Courgettes, carottes, tofu, fromage allégé, herbes de Provence",
                nutrients: "P : 28 g, G : 35 g, L : 17 g"
            }
        ]
    },
    lose: {
        breakfast: [
            {
                title: "Oeufs brouillés légers",
                calories: 300,
                description: "2 oeufs, blanc d'oeuf, épinards, champignons, pain complet",
                nutrients: "P : 20 g, G : 25 g, L : 10 g"
            },
            {
                title: "Smoothie bowl",
                calories: 280,
                description: "Fruits rouges, yaourt grec, graines de chia, flocons d'avoine",
                nutrients: "P : 15 g, G : 35 g, L : 8 g"
            },
            {
                title: "Toast avocat et oeuf",
                calories: 270,
                description: "Pain complet, demi avocat, oeuf poché",
                nutrients: "P : 14 g, G : 20 g, L : 11 g"
            },
            {
                title: "Pancakes légers",
                calories: 290,
                description: "Farine complète, oeuf, yaourt nature, compote",
                nutrients: "P : 16 g, G : 30 g, L : 6 g"
            }
        ],
        lunch: [
            {
                title: "Salade de thon",
                calories: 450,
                description: "Thon naturel, salade verte, tomates, concombre, oeuf dur, vinaigrette légère",
                nutrients: "P : 35 g, G : 20 g, L : 15 g"
            },
            {
                title: "Poulet et légumes rôtis",
                calories: 400,
                description: "Blanc de poulet, courgettes, poivrons, aubergines, huile d'olive",
                nutrients: "P : 40 g, G : 15 g, L : 12 g"
            },
            {
                title: "Bowl vegan minceur",
                calories: 420,
                description: "Tofu, riz complet, légumes vapeur, graines de courge",
                nutrients: "P : 30 g, G : 35 g, L : 10 g"
            },
            {
                title: "Soupe repas",
                calories: 350,
                description: "Soupe de légumes, lentilles, pain complet",
                nutrients: "P : 20 g, G : 30 g, L : 9 g"
            }
        ],
        snack: [
            {
                title: "Fromage blanc et fruits",
                calories: 150,
                description: "Fromage blanc 0%, pomme, cannelle",
                nutrients: "P : 15 g, G : 20 g, L : 0 g"
            },
            {
                title: "Fromage blanc entier, noix et graines",
                calories: 200,
                description: "Fromage blanc agrémenté de noix et de graines, un encas riche et équilibré.",
                nutrients: "P : 10 g, G : 4 g, L : 15 g"
              },
            {
                title: "Bâtonnets de légumes",
                calories: 100,
                description: "Carottes, céleri, concombre, houmous léger",
                nutrients: "P : 5 g, G : 10 g, L : 3 g"
            },
            {
                title: "Galettes de riz et thon",
                calories: 160,
                description: "Galettes de riz, thon au naturel",
                nutrients: "P : 12 g, G : 10 g, L : 5 g"
            },
            {
                title: "oeuf dur et tomate",
                calories: 120,
                description: "oeuf dur, tomate cerise, herbes",
                nutrients: "P : 10 g, G : 5 g, L : 7 g"
            }
        ],
        dinner: [
            {
                title: "Soupe et omelette",
                calories: 350,
                description: "Soupe de légumes maison, omelette aux herbes",
                nutrients: "P : 25 g, G : 20 g, L : 12 g"
            },
            {
                title: "Cabillaud vapeur",
                calories: 300,
                description: "Filet de cabillaud, ratatouille, riz complet",
                nutrients: "P : 30 g, G : 25 g, L : 8 g"
            },
            {
                title: "Tofu et légumes sautés",
                calories: 330,
                description: "Tofu, brocolis, champignons, sauce soja légère",
                nutrients: "P : 20 g, G : 15 g, L : 12 g"
            },
            {
                title: "Mini Frittatas au fromage",
                calories: 150,
                description: "oeufs battus avec fromage fondu, cuits en mini-moules pour une collation riche en protéines.",
                nutrients: "P : 12 g, G : 0.7 g, L : 11 g"
              },
              {
                title: "Boulettes de viande fourrées au fromage",
                calories: 128,
                description: "Boulettes de boeuf farcies au fromage, parfaites pour un apéritif protéiné.",
                nutrients: "P : 12.5 g, G : 0.2 g, L : 8.5 g"
              },
              {
                title: "Mélange de graines (amandes, noix de cajou, graines oméga)",
                calories: 187,
                description: "Un encas nutritif à base de noix et de graines riches en bons lipides.",
                nutrients: "P : 7 g, G : 6 g, L : 15 g"
              },
              {
                title: "Omelette aux épinards et feta",
                calories: 210,
                description: "oeufs, épinards frais et feta pour un petit déjeuner sain et rassasiant.",
                nutrients: "P : 14 g, G : 2 g, L : 16 g"
              },
              {
                title: "Saumon grillé à l’huile d’olive",
                calories: 250,
                description: "Pavé de saumon grillé à l’huile d’olive, riche en oméga-3.",
                nutrients: "P : 22 g, G : 0 g, L : 18 g"
              },
              {
                title: "Avocat farci au thon",
                calories: 220,
                description: "Demi-avocat garni de thon assaisonné, parfait pour une entrée riche en bons gras.",
                nutrients: "P : 11 g, G : 3 g, L : 18 g"
              },
              {
                title: "Salade de poulet, avocat, noix",
                calories: 320,
                description: "Morceaux de poulet, tranches d’avocat et cerneaux de noix sur lit de salade.",
                nutrients: "P : 24 g, G : 4 g, L : 23 g"
              },
              {
                title: "Chou-fleur rôti au parmesan",
                calories: 110,
                description: "Chou-fleur rôti avec du parmesan pour une garniture croustillante et légère.",
                nutrients: "P : 5 g, G : 4 g, L : 8 g"
              },
              {
                title: "oeufs cocotte au jambon",
                calories: 170,
                description: "oeufs cuits au four avec crème et dés de jambon pour une entrée gourmande.",
                nutrients: "P : 13 g, G : 1 g, L : 12 g"
              },

              {
                title: "Courgettes sautées au beurre",
                calories: 90,
                description: "Tranches de courgettes poêlées au beurre pour une garniture simple et savoureuse.",
                nutrients: "P : 2 g, G : 3 g, L : 8 g"
              },
              {
                title: "Brochettes de crevettes marinées",
                calories: 120,
                description: "Crevettes marinées et grillées, à servir en apéritif ou en plat principal.",
                nutrients: "P : 15 g, G : 1 g, L : 6 g"
              },
              {
                title: "Poêlée de champignons à la crème",
                calories: 130,
                description: "Champignons sautés à la crème pour accompagner une viande ou des oeufs.",
                nutrients: "P : 4 g, G : 3 g, L : 10 g"
              },
              {
                title: "Carpaccio de boeuf, huile d’olive",
                calories: 180,
                description: "Tranches fines de boeuf cru, arrosées d’huile d’olive et parsemées de parmesan.",
                nutrients: "P : 18 g, G : 0 g, L : 11 g"
              },
              {
                title: "Salade de saumon fumé, avocat",
                calories: 210,
                description: "Lamelles de saumon fumé et tranches d’avocat sur lit de salade verte.",
                nutrients: "P : 14 g, G : 2 g, L : 16 g"
              },
              {
                title: "Tartelette aux oeufs et bacon (sans pâte)",
                calories: 190,
                description: "Mini-tartelettes à base d'oeufs et de bacon, idéales pour le brunch.",
                nutrients: "P : 12 g, G : 1 g, L : 15 g"
              },
              {
                title: "Poulet curry coco",
                calories: 250,
                description: "Blancs de poulet mijotés au lait de coco et épices.",
                nutrients: "P : 22 g, G : 3 g, L : 17 g"
              },
              {
                title: "Gratin de brocoli au fromage",
                calories: 150,
                description: "Brocoli gratiné au fromage pour un accompagnement fondant et riche.",
                nutrients: "P : 8 g, G : 3 g, L : 11 g"
              },
              {
                title: "Sardines à l’huile d’olive",
                calories: 180,
                description: "Sardines en boîte ou grillées à l’huile, source de protéines et d’oméga-3.",
                nutrients: "P : 20 g, G : 0 g, L : 12 g"
              },
              {
                title: "Salade grecque (feta, olives, concombre)",
                calories: 170,
                description: "Mélange méditerranéen rafraîchissant et équilibré.",
                nutrients: "P : 7 g, G : 4 g, L : 13 g"
              },
              {
                title: "Rillettes de maquereau",
                calories: 160,
                description: "Tartinade de maquereau aux herbes et au fromage frais.",
                nutrients: "P : 13 g, G : 1 g, L : 11 g"
              },
            {
                title: "Salade d'épeautre",
                calories: 310,
                description: "Épeautre, tomates, féta allégée, roquette",
                nutrients: "P : 18 g, G : 30 g, L : 9 g"
            }
        ]
    },
    gain: {
        breakfast: [
            {
                title: "Crêpes protéinées",
                calories: 600,
                description: "Crêpes à la banane, oeufs, flocons d'avoine, sirop d'érable, beurre de cacahuète",
                nutrients: "P : 30 g, G : 75 g, L : 20 g"
            },
            {
                title: "Porridge protéiné",
                calories: 350,
                description: "Flocons d'avoine, lait d'amande, banane, noix et graines + WHEY pour un porridge sUUUUUUUper Power énervé 💪",
                nutrients: "P : 15 g, G : 50 g, L : 10 g"
            },
            {
                title: "Toast à l'avocat",
                calories: 550,
                description: "Pain complet, avocat, oeufs pochés, saumon fumé",
                nutrients: "P : 25 g, G : 40 g, L : 30 g"
            },
            {
                title: "Bol granola maison",
                calories: 620,
                description: "Granola, lait entier, fruits, graines de tournesol",
                nutrients: "P : 25 g, G : 70 g, L : 22 g"
            },
            {
                title: "Fromage blanc entier, noix et graines",
                calories: 200,
                description: "Fromage blanc agrémenté de noix et de graines, un encas riche et équilibré.",
                nutrients: "P : 10 g, G : 4 g, L : 15 g"
              },
            {
                title: "Omelette au fromage",
                calories: 580,
                description: "oeufs, fromage râpé, pain de seigle, avocat",
                nutrients: "P : 35 g, G : 40 g, L : 28 g"
            }
        ],
        lunch: [
            {
                title: "Steak et pommes de terre",
                calories: 700,
                description: "Steak haché 5%, patates douces rôties, haricots verts, sauce maison",
                nutrients: "P : 50 g, G : 60 g, L : 25 g"
            },
            {
                title: "Pâtes au saumon",
                calories: 650,
                description: "Pâtes complètes, saumon frais, crème légère, brocolis",
                nutrients: "P : 40 g, G : 70 g, L : 20 g"
            },
            {
                title: "Bowl riz et poulet curry",
                calories: 680,
                description: "Poulet au curry, riz basmati, noix de cajou, légumes grillés",
                nutrients: "P : 45 g, G : 65 g, L : 24 g"
            },
            {
                title: "Burger maison équilibré",
                calories: 720,
                description: "Pain complet, steak, cheddar, avocat, salade, sauce yaourt",
                nutrients: "P : 40 g, G : 60 g, L : 30 g"
            }
        ],
        snack: [
            {
                title: "Shake hypercalorique",
                calories: 400,
                description: "Lait entier, banane, beurre de cacahuète, flocons d'avoine, miel et pourquoi pas un peu WHEY!!!",
                nutrients: "P : 20 g, G : 50 g, L : 15 g"
            },
            {
                title: "Barres énergétiques",
                calories: 350,
                description: "Mélange de fruits secs, noix, graines et miel",
                nutrients: "P : 15 g, G : 40 g, L : 18 g"
            },
            {
                title: "Pain complet et fromage",
                calories: 300,
                description: "Pain aux céréales, fromage frais, graines",
                nutrients: "P : 18 g, G : 30 g, L : 14 g"
            },
            {
                title: "Banane et lait chocolaté",
                calories: 330,
                description: "Banane, lait entier, cacao en poudre non sucré",
                nutrients: "P : 14 g, G : 35 g, L : 12 g"
            }
        ],
        dinner: [
            {
                title: "Risotto aux champignons",
                calories: 600,
                description: "Riz arborio, champignons, parmesan, bouillon de légumes",
                nutrients: "P : 25 g, G : 80 g, L : 20 g"
            },
            {
                title: "Curry de poulet",
                calories: 550,
                description: "Cuisse de poulet, curry, lait de coco, riz basmati",
                nutrients: "P : 40 g, G : 50 g, L : 25 g"
            },
            {
                title: "Gratin de pâtes au thon",
                calories: 640,
                description: "Pâtes complètes, thon, béchamel légère, courgettes",
                nutrients: "P : 35 g, G : 70 g, L : 18 g"
            },
            {
                title: "Lasagnes maison",
                calories: 680,
                description: "Lasagnes à la viande, légumes, fromage, sauce tomate",
                nutrients: "P : 45 g, G : 60 g, L : 28 g"
            }
        ]
    }
};

// on verifie si la base de données est vide
db.collection('menus').doc('maintain').get().then((doc) => {
    if (!doc.exists) {
        console.log('Base de données vide, remplissage en cours...');
        // Remplissage de la base de données
        for (const goal in menusDatabase) {
            db.collection('menus').doc(goal).set(menusDatabase[goal]);
        }
    }
});



// Gestion du formulaire
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Récupération des valeurs
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const goal = document.getElementById('goal').value;

    // Calcul du métabolisme de base (BMR)
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Calcul des besoins caloriques (TDEE)
    let tdee = bmr * activity;

    // Ajustement selon l'objectif
    if (goal === 'lose') {
        tdee = tdee * 0.85; // Réduction de 15% pour la perte de poids
    } else if (goal === 'gain') {
        tdee = tdee * 1.15; // Augmentation de 15% pour la prise de poids
    }

    // Calcul des macronutriments
    const proteins = Math.round(weight * 1.8); // 1.8g de protéine par kg de poids
    const proteinsCal = proteins * 4;

    let fats, fatsCal;
    if (goal === 'lose') {
        fats = Math.round((tdee * 0.25) / 9); // 25% des calories en lipides
        fatsCal = tdee * 0.25;
    } else {
        fats = Math.round((tdee * 0.3) / 9); // 30% des calories en lipides
        fatsCal = tdee * 0.3;
    }

    const carbsCal = tdee - proteinsCal - fatsCal;
    const carbs = Math.round(carbsCal / 4);

    // Calcul de l'eau recommandée
    const water = Math.round((weight * 0.035) * 10) / 10; // 35ml par kg de poids

    // Affichage des résultats
    document.getElementById('caloriesResult').textContent = Math.round(tdee);
    document.getElementById('proteinsResult').textContent = proteins + 'g';
    document.getElementById('proteinsPercent').textContent = Math.round((proteinsCal / tdee) * 100);
    document.getElementById('carbsResult').textContent = carbs + 'g';
    document.getElementById('carbsPercent').textContent = Math.round((carbsCal / tdee) * 100);
    document.getElementById('fatsResult').textContent = fats + 'g';
    document.getElementById('fatsPercent').textContent = Math.round((fatsCal / tdee) * 100);
    document.getElementById('waterResult').textContent = water + 'L';

    // Ajustement des pourcentages de repas selon l'objectif
    if (goal === 'lose') {
        document.getElementById('breakfastPercent').textContent = '30';
        document.getElementById('lunchPercent').textContent = '35';
        document.getElementById('snackPercent').textContent = '10';
        document.getElementById('dinnerPercent').textContent = '25';
    } else if (goal === 'gain') {
        document.getElementById('breakfastPercent').textContent = '25';
        document.getElementById('lunchPercent').textContent = '30';
        document.getElementById('snackPercent').textContent = '20';
        document.getElementById('dinnerPercent').textContent = '25';
    } else {
        document.getElementById('breakfastPercent').textContent = '25';
        document.getElementById('lunchPercent').textContent = '35';
        document.getElementById('snackPercent').textContent = '15';
        document.getElementById('dinnerPercent').textContent = '25';
    }

    // Affichage des sections de résultats
    document.getElementById('resultsSection').classList.remove('hidden');
    document.getElementById('menusSection').classList.remove('hidden');

    // Sauvegarde du profil dans localStorage
    const profileData = { age, weight, height, activity, gender, goal };
    const user = firebase.auth().currentUser;
    if (user) {
        db.collection('profiles').doc(user.uid).set(profileData);
    } else {
        alert("Vous devez être connecté pour enregistrer votre profil.");
    }


    // Génération des menus
    generateMenus(goal, Math.round(tdee));

    // Scroll vers les résultats
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
});

// Fonction pour générer les menus
async function generateMenus(goal, calories) {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';

    const meals = ['breakfast', 'lunch', 'snack', 'dinner'];
    const mealNames = {
        breakfast: 'Petit-déjeuner',
        lunch: 'Déjeuner',
        snack: 'Collation',
        dinner: 'Dîner'
    };

    try {
        const menuDoc = await db.collection('menus').doc(goal).get();
        if (!menuDoc.exists) {
            console.log("No such document!");
            // Optionally, hide the menu section if no data is found
            document.getElementById('menusSection').classList.add('hidden');
            return;
        }

        const menusDatabase = menuDoc.data();

        // Sélection aléatoire de menus pour chaque repas
        meals.forEach(meal => {
            const availableMenus = menusDatabase[meal];
            if (!availableMenus || availableMenus.length === 0) return;

            const randomIndex = Math.floor(Math.random() * availableMenus.length);
            const selectedMenu = availableMenus[randomIndex];

            // Calcul du pourcentage de calories par rapport au total
            const caloriePercentage = Math.round((selectedMenu.calories / calories) * 100);

            // Création de la carte de menu
            const menuCard = document.createElement('div');
            menuCard.className = 'menu-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition duration-300';
            menuCard.innerHTML = `
                <div class="p-5">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-xl font-bold text-gray-800">${mealNames[meal]}</h3>
                        <span class="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">${caloriePercentage}%</span>
                    </div>
                    <div class="h-32 mb-4 overflow-hidden rounded-lg">
                        <div class="w-full h-full bg-gradient-to-r from-${getRandomColor()}-400 to-${getRandomColor()}-500 flex items-center justify-center text-white font-bold text-xl">
                            ${selectedMenu.title.split(' ')[0]}
                        </div>
                    </div>
                    <h4 class="font-semibold text-lg mb-2">${selectedMenu.title}</h4>
                    <p class="text-gray-600 mb-4">${selectedMenu.description}</p>
                    <div class="flex justify-between text-sm">
                        <span class="text-blue-600 font-medium">${selectedMenu.nutrients.split(', ')[0]}</span>
                        <span class="text-green-600 font-medium">${selectedMenu.nutrients.split(', ')[1]}</span>
                        <span class="text-yellow-600 font-medium">${selectedMenu.nutrients.split(', ')[2]}</span>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span class="text-gray-700 font-medium">${selectedMenu.calories} kcal</span>
                       <button class="text-purple-600 hover:text-purple-800 font-medium recipe-btn" data-recipe='${JSON.stringify(selectedMenu)}'>
                            <i class="fas fa-utensils mr-1"></i>Voir recette
                       </button>

                    </div>
                </div>
            `;

            menuContainer.appendChild(menuCard);
            menuCard.querySelector('.recipe-btn').addEventListener('click', (e) => {
                const recipe = JSON.parse(e.target.closest('button').dataset.recipe);
                localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
                window.location.href = 'recette.html';
            });
        });
    } catch (error) {
        console.error("Error getting menus: ", error);
    }
}

// Fonction utilitaire pour obtenir une couleur aléatoire
function getRandomColor() {
    const colors = ['purple', 'blue', 'green', 'yellow', 'red', 'indigo', 'pink'];
    return colors[Math.floor(Math.random() * colors.length)];
}
