INSERT INTO foods 
(name, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, serving_type, image)
VALUES
-- Meats & Poultry
('Chicken Breast', 165, 31, 0, 3.6, '100 g', NULL),
('Chicken Thigh', 209, 26, 0, 10.9, '100 g', NULL),
('Beef Sirloin', 210, 26, 0, 12, '100 g', NULL),
('Beef Ribeye', 290, 24, 0, 21, '100 g', NULL),
('Pork Tenderloin', 143, 26, 0, 4, '100 g', NULL),
('Ground Turkey', 170, 22, 0, 8, '100 g', NULL),
('Turkey Breast', 135, 30, 0, 1, '100 g', NULL),
('Lamb Chop', 282, 25, 0, 20, '100 g', NULL),
('Duck Breast', 337, 19, 0, 28, '100 g', NULL),
('Bacon', 541, 37, 1.4, 42, '100 g', NULL),

-- Fish & Seafood
('Salmon Fillet', 208, 20, 0, 13, '100 g', NULL),
('Tuna, canned in water', 132, 29, 0, 1, '100 g', NULL),
('Cod Fillet', 82, 18, 0, 0.7, '100 g', NULL),
('Tilapia', 96, 20, 0, 1.7, '100 g', NULL),
('Shrimp', 99, 24, 0.2, 0.3, '100 g', NULL),
('Crab Meat', 83, 18, 0, 1, '100 g', NULL),
('Lobster', 89, 19, 0, 0.9, '100 g', NULL),
('Sardines in oil', 208, 25, 0, 11, '100 g', NULL),
('Mackerel', 205, 19, 0, 13.9, '100 g', NULL),
('Trout', 190, 20, 0, 11, '100 g', NULL),

-- Dairy & Eggs
('Whole Egg', 72, 6.3, 0.4, 4.8, 'whole egg', NULL),
('Egg White', 52, 11, 0.7, 0.2, '100 g', NULL),
('Milk, whole', 61, 3.2, 5, 3.3, '1 cup', NULL),
('Milk, skim', 34, 3.4, 5, 0.1, '1 cup', NULL),
('Greek Yogurt, plain nonfat', 100, 17, 6, 0, '170 g', NULL),
('Cottage Cheese, low fat', 98, 11, 3.4, 4.3, '100 g', NULL),
('Cheddar Cheese', 402, 25, 1.3, 33, '100 g', NULL),
('Mozzarella Cheese', 280, 28, 3, 17, '100 g', NULL),
('Butter', 717, 0.9, 0, 81, '100 g', NULL),
('Cream Cheese', 342, 6, 4, 34, '100 g', NULL),

-- Grains & Starches
('White Rice, cooked', 130, 2.4, 28, 0.3, '100 g', NULL),
('Brown Rice, cooked', 112, 2.6, 23, 0.9, '100 g', NULL),
('Quinoa, cooked', 120, 4, 21, 2, '100 g', NULL),
('Oats, dry', 190, 7, 33, 4, '50 g', NULL),
('Barley, cooked', 123, 2.3, 28, 0.4, '100 g', NULL),
('Pasta, cooked', 157, 5.8, 30, 0.9, '100 g', NULL),
('Whole Wheat Bread', 70, 4, 12, 1, '1 slice', NULL),
('White Bread', 79, 2.7, 14, 1, '1 slice', NULL),
('Bagel', 289, 11, 56, 1.5, '1 piece', NULL),
('Tortilla, wheat', 140, 4, 24, 3, '1 piece', NULL),

-- Legumes & Plant Protein
('Lentils, cooked', 116, 9, 20, 0.4, '100 g', NULL),
('Chickpeas, cooked', 164, 8.9, 27, 2.6, '100 g', NULL),
('Kidney Beans, cooked', 127, 8.7, 22, 0.5, '100 g', NULL),
('Black Beans, cooked', 132, 8.9, 24, 0.5, '100 g', NULL),
('Edamame', 122, 11, 10, 5, '100 g', NULL),
('Tofu, firm', 76, 8, 2, 4.8, '100 g', NULL),
('Tempeh', 193, 20, 9, 11, '100 g', NULL),
('Seitan', 143, 21, 4, 2, '100 g', NULL),
('Hummus', 166, 8, 14, 9, '100 g', NULL),
('Peas, green', 81, 5, 14, 0.4, '100 g', NULL),

-- Vegetables
('Broccoli', 34, 2.8, 6.6, 0.4, '100 g', NULL),
('Spinach', 23, 2.9, 3.6, 0.4, '100 g', NULL),
('Kale', 49, 4.3, 9, 0.9, '100 g', NULL),
('Carrot', 41, 0.9, 10, 0.2, '100 g', NULL),
('Tomato', 18, 0.9, 3.9, 0.2, '100 g', NULL),
('Bell Pepper', 31, 1, 6, 0.3, '100 g', NULL),
('Zucchini', 17, 1.2, 3.1, 0.3, '100 g', NULL),
('Cucumber', 15, 0.7, 3.6, 0.1, '100 g', NULL),
('Cauliflower', 25, 1.9, 5, 0.3, '100 g', NULL),
('Mushrooms', 22, 3, 3, 0.3, '100 g', NULL),

-- Fruits
('Banana', 105, 1.3, 27, 0.3, 'whole banana', NULL),
('Apple', 95, 0.5, 25, 0.3, 'whole apple', NULL),
('Orange', 62, 1.2, 15, 0.2, 'whole orange', NULL),
('Grapes', 69, 0.7, 18, 0.2, '100 g', NULL),
('Pineapple', 50, 0.5, 13, 0.1, '100 g', NULL),
('Blueberries', 57, 0.7, 14, 0.3, '100 g', NULL),
('Strawberries', 32, 0.7, 7.7, 0.3, '100 g', NULL),
('Watermelon', 30, 0.6, 8, 0.2, '100 g', NULL),
('Kiwi', 42, 0.8, 10, 0.4, 'whole kiwi', NULL),
('Avocado', 160, 2, 9, 15, '100 g', NULL),

-- Nuts & Seeds
('Almonds', 579, 21, 22, 50, '100 g', NULL),
('Walnuts', 654, 15, 14, 65, '100 g', NULL),
('Peanuts', 567, 25, 16, 49, '100 g', NULL),
('Chia Seeds', 486, 17, 42, 31, '100 g', NULL),
('Flaxseeds', 534, 18, 29, 42, '100 g', NULL),
('Pumpkin Seeds', 559, 30, 11, 49, '100 g', NULL),
('Sunflower Seeds', 584, 21, 20, 51, '100 g', NULL),
('Cashews', 553, 18, 30, 44, '100 g', NULL),
('Pistachios', 562, 20, 28, 45, '100 g', NULL),
('Hazelnuts', 628, 15, 17, 61, '100 g', NULL),

-- Drinks & Others
('Black Coffee', 2, 0.3, 0, 0, '1 cup', NULL),
('Green Tea', 2, 0, 0, 0, '1 cup', NULL),
('Orange Juice', 45, 0.7, 10, 0.2, '1 cup', NULL),
('Protein Shake, whey', 120, 24, 3, 1, '1 scoop', NULL),
('Soy Milk', 54, 3.3, 6, 1.8, '1 cup', NULL),
('Coca-Cola', 140, 0, 39, 0, '1 can', NULL),
('Beer', 153, 1.6, 13, 0, '1 can', NULL),
('Red Wine', 125, 0.1, 4, 0, '1 glass', NULL),
('Olive Oil', 884, 0, 0, 100, '100 g', NULL),
('Peanut Butter', 588, 25, 20, 50, '100 g', NULL);

INSERT INTO exercises (name, category, default_sets, default_reps, description) VALUES
-- CHEST
('Barbell Bench Press', 'Chest', 4, 8, 'Compound movement focusing on mid chest and triceps involvement.'),
('Incline Barbell Bench Press', 'Chest', 4, 8, 'Emphasizes upper chest and front deltoids.'),
('Decline Bench Press', 'Chest', 4, 10, 'Targets lower chest region.'),
('Dumbbell Bench Press', 'Chest', 3, 10, 'Develops chest stabilizers with free weights.'),
('Incline Dumbbell Press', 'Chest', 3, 10, 'Emphasizes upper pecs and front delts.'),
('Dumbbell Flyes', 'Chest', 3, 12, 'Isolates chest for better stretch and contraction.'),
('Cable Crossover', 'Chest', 3, 12, 'Targets inner chest, keeps constant tension.'),
('Chest Press Machine', 'Chest', 3, 10, 'Simulates bench press safely with fixed motion.'),
('Push-Up', 'Chest', 3, 15, 'Bodyweight press focusing on middle chest.'),
('Decline Push-Up', 'Chest', 3, 15, 'Shifts emphasis to upper chest.'),
('Incline Push-Up', 'Chest', 3, 15, 'Targets lower chest area.'),
('Pec Deck Machine', 'Chest', 3, 12, 'Isolation for inner and middle pecs.'),
('Floor Press', 'Chest', 3, 8, 'Shorter range of motion, emphasizes triceps and mid-chest.'),
('Svend Press', 'Chest', 3, 15, 'Inner chest activation using plate press motion.'),

-- BACK
('Pull-Up', 'Back', 4, 6, 'Focuses on upper lats and teres major.'),
('Chin-Up', 'Back', 4, 8, 'Engages lower lats and biceps.'),
('Lat Pulldown (Wide Grip)', 'Back', 4, 10, 'Emphasizes upper lats for width.'),
('Lat Pulldown (Close Grip)', 'Back', 4, 10, 'Targets lower lats.'),
('Reverse Grip Pulldown', 'Back', 4, 10, 'Works lower lats and biceps more.'),
('Seated Cable Row', 'Back', 3, 10, 'Builds mid-back and rhomboids.'),
('Single-Arm Dumbbell Row', 'Back', 3, 10, 'Emphasizes lower lats and traps.'),
('T-Bar Row', 'Back', 3, 10, 'Focuses on middle back thickness.'),
('Barbell Bent-Over Row', 'Back', 4, 8, 'Compound pulling movement for lats and rear delts.'),
('Deadlift', 'Back', 3, 5, 'Works entire posterior chain—glutes, hamstrings, erectors.'),
('Inverted Row', 'Back', 3, 12, 'Bodyweight back exercise for mid traps and rhomboids.'),
('Straight-Arm Pulldown', 'Back', 3, 12, 'Isolates lats through full range.'),
('Machine Row', 'Back', 3, 10, 'Controlled motion for middle and lower lats.'),
('Face Pull', 'Back', 3, 12, 'Reinforces rear delts and upper traps.'),

-- SHOULDERS
('Overhead Press', 'Shoulders', 4, 8, 'Hits all three deltoid heads, mainly anterior and medial.'),
('Seated Dumbbell Shoulder Press', 'Shoulders', 4, 10, 'Emphasizes front and side delts.'),
('Arnold Press', 'Shoulders', 3, 10, 'Targets anterior and medial delts.'),
('Front Raise', 'Shoulders', 3, 12, 'Isolates anterior deltoid.'),
('Lateral Raise', 'Shoulders', 3, 15, 'Focuses on medial deltoid for width.'),
('Cable Lateral Raise', 'Shoulders', 3, 15, 'Constant tension on side delts.'),
('Rear Delt Fly', 'Shoulders', 3, 15, 'Isolates rear deltoids for balance.'),
('Upright Row', 'Shoulders', 3, 10, 'Traps and medial delts engagement.'),
('Machine Shoulder Press', 'Shoulders', 3, 10, 'Safe compound press for overall shoulders.'),
('Barbell Front Raise', 'Shoulders', 3, 12, 'Works front delts and upper traps.'),
('Reverse Pec Deck', 'Shoulders', 3, 12, 'Rear delt isolation for posture improvement.'),
('Plate Front Raise', 'Shoulders', 3, 12, 'Alternative anterior deltoid movement.'),
('Behind-the-Neck Press', 'Shoulders', 3, 8, 'Old-school press for full delt activation.'),

-- ARMS (Biceps)
('Barbell Curl', 'Arms', 3, 10, 'Works both biceps heads for strength and mass.'),
('EZ-Bar Curl', 'Arms', 3, 10, 'Reduces wrist strain; targets biceps brachii.'),
('Dumbbell Curl', 'Arms', 3, 10, 'Alternating curl for balanced development.'),
('Incline Dumbbell Curl', 'Arms', 3, 12, 'Stretches long head for peak shape.'),
('Concentration Curl', 'Arms', 3, 12, 'Isolates short head for peak.'),
('Preacher Curl', 'Arms', 3, 10, 'Focuses on lower portion of biceps.'),
('Hammer Curl', 'Arms', 3, 12, 'Targets brachialis and forearms.'),
('Cable Curl', 'Arms', 3, 12, 'Constant tension across ROM.'),
('Zottman Curl', 'Arms', 3, 10, 'Engages both biceps and forearms.'),
('Machine Curl', 'Arms', 3, 12, 'Controlled isolation for biceps.'),

-- ARMS (Triceps)
('Close-Grip Bench Press', 'Arms', 3, 8, 'Compound lift emphasizing triceps.'),
('Triceps Pushdown', 'Arms', 3, 12, 'Targets lateral triceps head.'),
('Overhead Triceps Extension', 'Arms', 3, 12, 'Focuses on long triceps head.'),
('Skull Crushers', 'Arms', 3, 10, 'Emphasizes long head and medial head of triceps.'),
('Dips', 'Arms', 3, 10, 'Bodyweight press engaging triceps and chest.'),
('Diamond Push-Up', 'Arms', 3, 15, 'Bodyweight triceps isolation.'),
('Kickback', 'Arms', 3, 12, 'Isolates long head of triceps.'),
('Cable Overhead Extension', 'Arms', 3, 12, 'Constant tension triceps exercise.'),
('Rope Pushdown', 'Arms', 3, 12, 'Enhances triceps peak contraction.'),
('Bench Dips', 'Arms', 3, 15, 'Targets lateral triceps and lower chest.'),

-- LEGS (Quads)
('Barbell Squat', 'Legs', 4, 8, 'Compound lift targeting quads, glutes, and core.'),
('Front Squat', 'Legs', 4, 8, 'Places greater emphasis on quadriceps.'),
('Leg Press', 'Legs', 4, 10, 'Focuses on quads with minimal core strain.'),
('Lunges', 'Legs', 3, 12, 'Targets quads and glutes unilaterally.'),
('Bulgarian Split Squat', 'Legs', 3, 10, 'Deep quad engagement for balance and strength.'),
('Step-Up', 'Legs', 3, 12, 'Works quads and glutes.'),
('Sissy Squat', 'Legs', 3, 12, 'Intense isolation for quadriceps.'),
('Leg Extension', 'Legs', 3, 15, 'Isolates quadriceps muscle group.'),
('Hack Squat', 'Legs', 4, 10, 'Emphasizes front thigh development.'),
('Wall Sit', 'Legs', 3, 60, 'Isometric hold for quadriceps endurance.'),

-- LEGS (Hamstrings & Glutes)
('Romanian Deadlift', 'Legs', 3, 10, 'Stretches and strengthens hamstrings and glutes.'),
('Glute Bridge', 'Legs', 3, 15, 'Isolates glutes and posterior chain.'),
('Hip Thrust', 'Legs', 4, 10, 'Targets glute maximus for power.'),
('Leg Curl', 'Legs', 3, 12, 'Hamstring isolation movement.'),
('Cable Kickback', 'Legs', 3, 12, 'Glute-focused isolation exercise.'),
('Good Morning', 'Legs', 3, 10, 'Hamstring and lower back strengthening.'),
('Sumo Deadlift', 'Legs', 3, 6, 'Hits glutes, inner thighs, and hamstrings.'),
('Single-Leg Deadlift', 'Legs', 3, 12, 'Balances hamstring strength side to side.'),
('Kettlebell Swing', 'Legs', 3, 15, 'Dynamic power move for glutes and hips.'),
('Cable Pull-Through', 'Legs', 3, 12, 'Emphasizes hip hinge and glute activation.'),

-- CALVES
('Standing Calf Raise', 'Legs', 4, 15, 'Targets gastrocnemius for mass.'),
('Seated Calf Raise', 'Legs', 4, 20, 'Emphasizes soleus muscle.'),
('Donkey Calf Raise', 'Legs', 3, 15, 'Provides deep calf stretch and contraction.'),
('Smith Calf Raise', 'Legs', 4, 12, 'Controlled calf isolation with added load.'),
('Single-Leg Calf Raise', 'Legs', 3, 15, 'Improves unilateral calf strength.'),

-- CORE
('Crunch', 'Core', 3, 20, 'Upper abs activation.'),
('Reverse Crunch', 'Core', 3, 15, 'Targets lower abdominal area.'),
('Plank', 'Core', 3, 60, 'Full core isometric hold.'),
('Side Plank', 'Core', 3, 45, 'Emphasizes obliques and stabilizers.'),
('Hanging Leg Raise', 'Core', 3, 12, 'Engages lower abs and hip flexors.'),
('Cable Woodchopper', 'Core', 3, 12, 'Rotational core exercise for obliques.'),
('Russian Twist', 'Core', 3, 15, 'Twisting motion for oblique engagement.'),
('Mountain Climber', 'Core', 3, 20, 'Core and cardio hybrid movement.'),
('Ab Wheel Rollout', 'Core', 3, 10, 'Advanced core stability drill.'),
('V-Ups', 'Core', 3, 12, 'Simultaneously works upper and lower abs.'),

-- FULL BODY / FUNCTIONAL
('Clean and Press', 'Full Body', 4, 6, 'Explosive full-body lift working shoulders, legs, and back.'),
('Snatch', 'Full Body', 4, 6, 'Olympic lift training power and coordination.'),
('Burpee', 'Full Body', 3, 15, 'Combines push-up and jump for total-body conditioning.'),
('Farmer’s Carry', 'Full Body', 3, 40, 'Improves grip, traps, and core stability.'),
('Kettlebell Clean', 'Full Body', 3, 8, 'Full-body coordination and power exercise.'),
('Medicine Ball Slam', 'Full Body', 3, 12, 'Explosive total-body conditioning move.'),
('Jump Squat', 'Full Body', 3, 12, 'Enhances leg power and explosiveness.'),
('Battle Rope Slam', 'Full Body', 3, 20, 'Intense conditioning for upper body and core.'),
('Sled Push', 'Full Body', 3, 20, 'Lower-body power and endurance exercise.'),
('Bear Crawl', 'Full Body', 3, 30, 'Improves mobility and total-body coordination.');

-- =============================
-- PLAN 1: Upper/Lower Split (4 days)
-- =============================
INSERT INTO workout_plans (name, description)
VALUES ('Upper/Lower Split (4-Day)', 'Alternating upper and lower body training focused on compound strength and balanced hypertrophy.');

-- assume plan_id = 1
INSERT INTO plan_days (plan_id, day_number, day_type) VALUES
(1,1,'Upper'),
(1,2,'Lower'),
(1,3,'Upper'),
(1,4,'Lower');

-- Upper day
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 1, exercise_id, 4, 8 FROM exercises WHERE name IN ('Barbell Bench Press','Barbell Bent-Over Row');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 1, exercise_id, 3, 10 FROM exercises WHERE name IN ('Overhead Press','Pull-Up','Biceps Curl','Triceps Pushdown');

-- Lower day
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 2, exercise_id, 4, 8 FROM exercises WHERE name IN ('Barbell Squat','Romanian Deadlift');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 2, exercise_id, 3, 12 FROM exercises WHERE name IN ('Lunges','Leg Curl','Standing Calf Raise');

-- Second Upper / Lower repeat with minor variation
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 3, exercise_id, 4, 8 FROM exercises WHERE name IN ('Incline Dumbbell Press','T-Bar Row');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 3, exercise_id, 3, 10 FROM exercises WHERE name IN ('Lateral Raise','Hammer Curl','Overhead Triceps Extension');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 4, exercise_id, 4, 8 FROM exercises WHERE name IN ('Deadlift','Leg Press');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 4, exercise_id, 3, 12 FROM exercises WHERE name IN ('Leg Extension','Glute Bridge','Seated Calf Raise');

-- =============================
-- PLAN 2: Push/Pull/Legs (6 days)
-- =============================
INSERT INTO workout_plans (name, description)
VALUES ('Push/Pull/Legs (6-Day)', 'Classic hypertrophy split: two push, two pull, two legs sessions each week.');

-- assume plan_id = 2
INSERT INTO plan_days (plan_id, day_number, day_type) VALUES
(2,1,'Push'),
(2,2,'Pull'),
(2,3,'Legs'),
(2,4,'Push'),
(2,5,'Pull'),
(2,6,'Legs');

-- Push
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 5, exercise_id, 4, 8 FROM exercises WHERE name IN ('Barbell Bench Press','Overhead Press');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 5, exercise_id, 3, 12 FROM exercises WHERE name IN ('Incline Dumbbell Press','Lateral Raise','Triceps Pushdown');

-- Pull
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 6, exercise_id, 4, 8 FROM exercises WHERE name IN ('Pull-Up','Barbell Bent-Over Row');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 6, exercise_id, 3, 12 FROM exercises WHERE name IN ('Face Pull','Hammer Curl','Lat Pulldown (Wide Grip)');

-- Legs
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 7, exercise_id, 4, 8 FROM exercises WHERE name IN ('Barbell Squat','Romanian Deadlift');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 7, exercise_id, 3, 12 FROM exercises WHERE name IN ('Leg Press','Walking Lunge','Standing Calf Raise');

-- repeat second half (Push/Pull/Legs)
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 8, exercise_id, 4, 8 FROM exercises WHERE name IN ('Incline Bench Press','Arnold Press');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 8, exercise_id, 3, 12 FROM exercises WHERE name IN ('Front Raise','Overhead Triceps Extension','Lateral Raise');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 9, exercise_id, 4, 8 FROM exercises WHERE name IN ('Chin-Up','Seated Cable Row');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 9, exercise_id, 3, 12 FROM exercises WHERE name IN ('Reverse Grip Pulldown','Barbell Curl','Rear Delt Fly');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 10, exercise_id, 4, 8 FROM exercises WHERE name IN ('Front Squat','Leg Curl');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 10, exercise_id, 3, 12 FROM exercises WHERE name IN ('Hip Thrust','Seated Calf Raise','Cable Kickback');

-- =============================
-- PLAN 3: Full-Body (3 days)
-- =============================
INSERT INTO workout_plans (name, description)
VALUES ('Full-Body Strength (3-Day)', 'Full-body each session emphasizing compound movements for strength and efficiency.');

INSERT INTO plan_days (plan_id, day_number, day_type) VALUES
(3,1,'FullBody'),
(3,2,'FullBody'),
(3,3,'FullBody');

INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 11, exercise_id, 4, 8 FROM exercises WHERE name IN ('Barbell Squat','Barbell Bench Press','Barbell Bent-Over Row');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 11, exercise_id, 3, 12 FROM exercises WHERE name IN ('Plank');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 12, exercise_id, 4, 8 FROM exercises WHERE name IN ('Deadlift','Overhead Press','Pull-Up');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 12, exercise_id, 3, 12 FROM exercises WHERE name IN ('Hanging Leg Raise');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 13, exercise_id, 4, 8 FROM exercises WHERE name IN ('Front Squat','Incline Dumbbell Press','Lat Pulldown (Wide Grip)');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 13, exercise_id, 3, 12 FROM exercises WHERE name IN ('Russian Twist');

-- =============================
-- PLAN 4: Bro Split (5 days)
-- =============================
INSERT INTO workout_plans (name, description)
VALUES ('Bro Split (5-Day)', 'Traditional body-part split: one major muscle per day.');

INSERT INTO plan_days (plan_id, day_number, day_type) VALUES
(4,1,'Chest'),
(4,2,'Back'),
(4,3,'Shoulders'),
(4,4,'Arms'),
(4,5,'Legs');

-- chest
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 14, exercise_id, 4, 10 FROM exercises WHERE name IN ('Barbell Bench Press','Incline Dumbbell Press','Cable Crossover');
-- back
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 15, exercise_id, 4, 10 FROM exercises WHERE name IN ('Pull-Up','Barbell Bent-Over Row','Seated Cable Row');
-- shoulders
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 16, exercise_id, 4, 10 FROM exercises WHERE name IN ('Overhead Press','Lateral Raise','Rear Delt Fly');
-- arms
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 17, exercise_id, 4, 10 FROM exercises WHERE name IN ('Barbell Curl','Triceps Pushdown','Hammer Curl','Overhead Triceps Extension');
-- legs
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 18, exercise_id, 4, 10 FROM exercises WHERE name IN ('Barbell Squat','Leg Press','Romanian Deadlift','Standing Calf Raise');

-- =============================
-- PLAN 5: Hypertrophy 5-Day Split
-- =============================
INSERT INTO workout_plans (name, description)
VALUES ('5-Day Hypertrophy', 'Volume-focused split alternating compound and isolation exercises.');

INSERT INTO plan_days (plan_id, day_number, day_type) VALUES
(5,1,'Push'),
(5,2,'Pull'),
(5,3,'Legs'),
(5,4,'Upper'),
(5,5,'Lower');

-- (example similar to above but different combos)
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 19, exercise_id, 3, 12 FROM exercises WHERE name IN ('Incline Dumbbell Press','Overhead Press','Triceps Pushdown','Lateral Raise');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 20, exercise_id, 3, 12 FROM exercises WHERE name IN ('Pull-Up','T-Bar Row','Barbell Curl','Rear Delt Fly');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 21, exercise_id, 4, 10 FROM exercises WHERE name IN ('Barbell Squat','Leg Press','Leg Curl','Standing Calf Raise');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 22, exercise_id, 3, 12 FROM exercises WHERE name IN ('Barbell Bench Press','Barbell Row','Overhead Press','Hammer Curl');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 23, exercise_id, 4, 10 FROM exercises WHERE name IN ('Deadlift','Front Squat','Leg Extension','Seated Calf Raise');

-- =============================
-- PLAN 6: Athlete 4-Day Functional
-- =============================
INSERT INTO workout_plans (name, description)
VALUES ('Athletic Performance (4-Day)', 'Functional power and mobility training for athletes.');

INSERT INTO plan_days (plan_id, day_number, day_type) VALUES
(6,1,'Power'),
(6,2,'Speed'),
(6,3,'Mobility'),
(6,4,'FullBody');

INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 24, exercise_id, 4, 6 FROM exercises WHERE name IN ('Power Clean','Front Squat','Push Press','Romanian Deadlift');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 25, exercise_id, 3, 10 FROM exercises WHERE name IN ('Jump Squat','Kettlebell Swing','Burpee','Battle Rope Slam');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 26, exercise_id, 3, 12 FROM exercises WHERE name IN ('Cable Woodchopper','Side Plank','Bear Crawl','Medicine Ball Slam');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 27, exercise_id, 3, 8 FROM exercises WHERE name IN ('Clean and Press','Deadlift','Pull-Up','Overhead Press');

-- =============================
-- PLAN 7: Beginner 3-Day Full Body
-- =============================
INSERT INTO workout_plans (name, description)
VALUES ('Beginner Full-Body (3-Day)', 'Introductory program focusing on proper form and balanced muscle activation.');

INSERT INTO plan_days (plan_id, day_number, day_type) VALUES
(7,1,'FullBody'),
(7,2,'FullBody'),
(7,3,'FullBody');

INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 28, exercise_id, 3, 10 FROM exercises WHERE name IN ('Barbell Squat','Barbell Bench Press','Barbell Row','Plank');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 29, exercise_id, 3, 10 FROM exercises WHERE name IN ('Deadlift','Overhead Press','Pull-Up','Hanging Leg Raise');
INSERT INTO plan_day_exercises (plan_day_id, exercise_id, sets, reps)
SELECT 30, exercise_id, 3, 10 FROM exercises WHERE name IN ('Front Squat','Incline Dumbbell Press','Lat Pulldown (Wide Grip)','Russian Twist');
