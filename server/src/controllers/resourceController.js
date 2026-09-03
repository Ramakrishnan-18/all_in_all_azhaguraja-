// Generic REST controller factory for the simple resource entities.
// Exposes public (published/enabled only) read + full admin CRUD.
// Optionally accepts a beforeSave hook to validate/normalize payloads.
export function createResourceController(
  model,
  { publicFilter = {}, searchable = [], beforeSave = async () => ({}) } = {}
) {
  const publicSelect = (doc) => doc;

  return {
    // Public list — only published/enabled items, sorted newest first.
    listPublic: async (req, res) => {
      const docs = await model.find(publicFilter).sort({ createdAt: -1 }).lean();
      res.json(docs.map(publicSelect));
    },

    // Public single.
    getPublic: async (req, res) => {
      const doc = await model.findOne({ _id: req.params.id, ...publicFilter }).lean();
      if (!doc) return res.status(404).json({ message: "Not found" });
      res.json(doc);
    },

    // Admin list — all items (drafts included).
    listAll: async (req, res) => {
      const { search } = req.query;
      let query = {};
      if (search && searchable.length > 0) {
        const regex = new RegExp(search, "i");
        query.$or = searchable.map((f) => ({ [f]: regex }));
      }
      const docs = await model.find(query).sort({ createdAt: -1 }).lean();
      res.json(docs);
    },

    create: async (req, res) => {
      const validated = await beforeSave(req.body, null, req);
      const doc = await model.create({ ...req.body, ...validated });
      res.status(201).json(doc);
    },

    update: async (req, res) => {
      const validated = await beforeSave(req.body, req.params.id, req);
      const doc = await model.findByIdAndUpdate(req.params.id, { ...req.body, ...validated }, {
        new: true,
        runValidators: true,
      });
      if (!doc) return res.status(404).json({ message: "Not found" });
      res.json(doc);
    },

    remove: async (req, res) => {
      const doc = await model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: "Not found" });
      res.json({ success: true });
    },
  };
}
