const fileLocations = {
    botnetMapCache: {
        location: '/botnet/maps',
        maps: ['active', 'all', 'idle'],
        suffix: '-botnets.txt'
    },
    nmapCache: {
        location: '/trove/maps',
        maps: ['all', 'owned', 'pwned'],
        suffix: '-servers.txt'
    }
};

export default fileLocations;
export {fileLocations};
