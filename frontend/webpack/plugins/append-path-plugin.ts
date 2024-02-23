function stringIncludes(string, maybeString) {
    // String.includes throws if the argument is not a string
    return typeof maybeString === 'string' ? string.includes(maybeString) : false;
}

/**
 * TODO: 后续参考plugin的写法方式
 */

export default class AppendPathPlugin {
    options?: {
        prePath?: string;
        include?: string[];
        exclude?: string[];
    };

    constructor(options) {
        this.options = options;
    }

    /**
     * @param {Resolver} resolver the resolver
     * @returns {void}
     */
    apply(resolver) {
        const fs = resolver.fileSystem;

        resolver.getHook('before-resolved').tapAsync('AppendPathPlugins', (request, resolveContext, callback) => {
            const dirPath = request.path;

            if (!this.options || !this.options.prePath || !dirPath) {
                return callback();
            }

            if (!dirPath) return callback();

            // return if path matches with excludes
            if (
                this.options.exclude &&
                this.options.exclude.some(function (exclude) {
                    return dirPath.search(exclude) >= 0 || stringIncludes(dirPath, exclude);
                })
            ) {
                return callback();
            }

            // return if path doesn't match with includes
            if (
                this.options.include &&
                !this.options.include.some(function (include) {
                    return dirPath.search(include) >= 0 || stringIncludes(dirPath, include);
                })
            ) {
                return callback();
            }

            try {
                const stats = fs.statSync(dirPath);
                if (!stats) {
                    return callback();
                }

                if (stats.isFile()) {
                    const pathDirArr = dirPath.split('/');
                    pathDirArr.splice(-1, 0, this.options.prePath);
                    const _path = pathDirArr.join('/');
                    if (fs.statSync(_path).isFile()) {
                        request.path = _path;
                    }
                }
                return callback();
                // resolver.doResolve(target, request, 'existing file: ' + dirPath, resolveContext, callback);
            } catch (error) {
                return callback();
            }
        });
    }
}
