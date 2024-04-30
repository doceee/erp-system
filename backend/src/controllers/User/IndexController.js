const { Op } = require('sequelize');
const util = require('util');

class UserIndexController {
    constructor(userRepository, cache) {
        this.userRepository = userRepository;
        this.cache = cache;
    }

    async invoke(req, res) {
        const { name } = req.query,
            where = {},
            page = parseInt(req.query.page) || 1,
            limit = 10,
            offset = currentPage => (currentPage - 1) * limit;

        if (name) {
            where[Op.or] = {
                firstName: {
                    [Op.like]: `%${name}%`
                },
                lastName: {
                    [Op.like]: `%${name}%`
                }
            };
        }

        const cacheKeyParameters = util.inspect(
                { where },
                { showHidden: false, depth: null }
            ),
            cacheKey = `users:index:${page}:${limit}:${offset(
                page
            )}:${Buffer.from(cacheKeyParameters).toString('base64')}`;

        const isCachedData = await this.cache.exists(cacheKey);

        if (isCachedData) {
            const users = await this.cache.get(cacheKey);

            return res.send(users);
        }

        const { count, rows } = await this.userRepository.findAndCountAll({
            offset: offset(page),
            limit,
            where,
            order: [['createdAt', 'DESC']]
        });

        const pages = Math.ceil(count / limit);

        const { rows: secondPageRows } =
            await this.userRepository.findAndCountAll({
                offset: offset(page + 1),
                limit,
                where,
                order: [['createdAt', 'DESC']]
            });

        const users = {
            limit,
            count,
            pages,
            page,
            secondPage: secondPageRows,
            rows
        };

        await this.cache.set(cacheKey, users);

        return res.send(users);
    }
}

module.exports = UserIndexController;
