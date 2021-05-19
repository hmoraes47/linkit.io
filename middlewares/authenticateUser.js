module.exports = (req, res, next) => {
    if(!req.session.user) {
        res.send("Você não tem autorização para ver esse conteúdo. Erro: 403+1");
        return;
    }

    next();
}