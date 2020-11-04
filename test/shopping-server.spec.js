const ShoppingService = require('../src/shopping-service');
const knex = require('knex')

describe(`Shopping List Service object`, function() {
    let db;
    let testItems = [
        {
            id: 1,
            name: 'First test item',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            price: '12.00',
            category: 'Main'
        },
        {
            id: 2,
            name: 'Second test item',
            date_added: new Date('2100-05-22T16:28:32.615Z'),
            price: '21.00',
            category: 'Snack'
        },
        {
            id: 3,
            name: 'Third test item',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            price: '0.99',
            category: 'Breakfast'
        },
    ];

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.DB_URL,
        });
    });

    before(() => db('shopping').truncate());

    afterEach(() => db('shopping').truncate())

    after(() => db.destroy());

    context(`Given 'shopping' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping')
                .insert(testItems);
        });

            it(`getAllItem() resolves all items from 'shopping' table`, () => {
            const expectedItems = testItems.map(item => ({
                ...item,
                checked: false,
            }));
            return ShoppingService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(expectedItems);
                });
        });

        it(`getById() resolves an item by id from 'shopping' table`, () => {
            const idToGet = 3;
            const thirdItem = testItems[idToGet - 1];
            return ShoppingService.getById(db, idToGet)
                .then(actual => {
                    expect(actual).to.eql({
                        id: idToGet,
                        name: thirdItem.name,
                        date_added: thirdItem.date_added,
                        price: thirdItem.price,
                        category: thirdItem.category,
                        checked: false,
                    });
                });
        });

        it(`deleteItem() removes an item by id from 'shopping' table`, () => {
            const idToDelete = 3;
            return ShoppingService.deleteItem(db, idToDelete)
                .then(() => ShoppingService.getAllItems(db))
                .then(allItems => {
                    const expected = testItems
                        .filter(item => item.id !== idToDelete)
                        .map(item => ({
                            ...item,
                            checked: false,
                        }));
                    expect(allItems).to.eql(expected);
                });
        });

        it(`updateItem() updates an item in the 'shopping' table`, () => {
            const idOfITemToUpdate = 3;
            const newItemData = {
                name: 'update title',
                price: '99.99',
                date_added: new Date(),
                checked: true,
            };
            const originalItem = testItems[idOfITemToUpdate - 1];
            return ShoppingService.updateItem(db, idOfITemToUpdate, newItemData)
                .then(() => ShoppingService.getById(db, idOfITemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfITemToUpdate,
                        ...originalItem,
                        ...newItemData,
                    });
                });
        });
    });

    context(`Given 'shopping' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([]);
                });
        });

        it(`insertItem() inserts an item and resolves it with an 'id'`, () => {
            const newItem = {
                name: 'Test new name name',
                price: '5.05',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: true,
                category: 'Lunch',
            };
            return ShoppingService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category,
                    });
                });
        });
    });    
});