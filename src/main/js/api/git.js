var NodeGit = require("nodegit");
var fse = require('fs-extra');
var path = require("path");

exports.init = function(pathToRepo, onInit) {
    var pathToRepo = path.resolve(pathToRepo);

    fse.emptyDirSync(pathToRepo);
    NodeGit.Repository.init(pathToRepo, 0)
        .then(function (repo) {
            var signature = NodeGit.Signature.default(repo);
            var initIndex;

            repo.refreshIndex()
                .then(function (index) {
                    initIndex = index;
                    return index.write();
                })
                .then(function (index) {
                    return initIndex.writeTree();
                })
                .then(function (oid) {
                    return repo.createCommit("HEAD", signature, signature, 'initial commit', oid, []);
                })
                .done(function() {
                    if (onInit) {
                        onInit({
                            repo: repo,
                            copyDirToRepo: function(dir) {
                                var pathToFiles = path.resolve(dir);

                                if (!fse.existsSync(pathToFiles)) {
                                    throw new Error('No such directory: ' + pathToFiles);
                                }
                                if (!fse.statSync(pathToFiles).isDirectory()) {
                                    throw new Error('Not a directory: ' + pathToFiles);
                                }

                                fse.copySync(pathToFiles, pathToRepo);
                            },
                            commit: function (message) {
                                if (!message) {
                                    message = 'commit all';
                                }

                                var index;
                                var oid;
                                var returnPromise = repo.refreshIndex()
                                    .then(function (indexResult) {
                                        index = indexResult;
                                    })
                                    .then(function () {
                                        return index.addAll();
                                    })
                                    .then(function () {
                                        return index.write();
                                    })
                                    .then(function () {
                                        return index.writeTree();
                                    })
                                    .then(function (oidResult) {
                                        oid = oidResult;
                                        return NodeGit.Reference.nameToId(repo, "HEAD");
                                    })
                                    .then(function (head) {
                                        return repo.getCommit(head);
                                    })
                                    .then(function (parent) {
                                        return repo.createCommit("HEAD", signature, signature, message, oid, [parent]);
                                    });

                                return returnPromise;
                            },
                            createRepo: function(fromDir, inDir) {
                                repo.copyDirToRepo(fromDir);
                                return repo.commit('Added ');
                            }
                        });
                    }
                });

        });
};

exports.createRepo = function(fromDir, inDir) {
    return new Promise(function(resolve, reject) {
        exports.init(inDir, function (repo) {
            repo.copyDirToRepo(fromDir);
            repo.commit('Copied files from ' + fromDir)
                .then(resolve)
                .catch(reject);
        });
    });
};

exports.createBranch = function(branchName, pathToRepo) {
    var pathToRepo = path.resolve(pathToRepo);

    return NodeGit.Repository.open(pathToRepo)
        .then(function(repo) {
            return repo.getHeadCommit()
                .then(function (commit) {
                    return repo.createBranch(
                        branchName,
                        commit, 0,
                        repo.defaultSignature(),
                        'Created "' + branchName + '" branch on HEAD');
                });
        });
};
