const ShoppingService = {
    getAllItems(knex) {
        return knex
            .select('*')
            .from('shopping');
    },
    getById(knex, id) {
        return knex
            .from('shopping')
            .select('*')
            .where('id', id)
            .first();
    },
    deleteItem(knex, id) {
        return knex('shopping')
            .where({ id })
            .delete();
    },
    updateItem(knex, id, newItemFields) {
        return knex('shopping')
            .where({ id })
            .update(newItemFields);
    },
    insertItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping')
            .returning('*')
            .then(rows => rows[0])
    },
};

module.exports = ShoppingService;