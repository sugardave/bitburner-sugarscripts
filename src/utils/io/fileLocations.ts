const fileLocations = {
    botnetMap: {
        location: '/botnet/maps',
        maps: ['active', 'all', 'idle'],
        suffix: '-botnets.txt'
    },
    nmap: {
        location: '/trove/maps',
        maps: ['all', 'owned', 'pwned'],
        suffix: '-servers.txt'
    }
};

export default fileLocations;
export {fileLocations};
