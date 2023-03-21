
// TODO: Not sure how poison will work yet.
// This will have a damage over time effect obviously, but I would like for
// DOTs to have different strength levels. If you have an ability that poisons
// then you should be able to level up that effect. That increases damage, the
// DC to resist, the number of rounds poisoned all that. The status object on
// the condition has options, so all that needs to go there, but does the
// status itself need something that flags it as needing these details to work?
const poison = new StatusType(_poison, {});

StatusType.register(poison);
