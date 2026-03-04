export const timeAgoShort = (date: string | number | Date) => {
    const now = new Date();
    const past = new Date(now);
    const seconds = Math.floor(now.getTime() - past.getTime()/1000)
    
    const intervals: [ number, string][] = [
        [31536000, "y"], // 60*60*24*365
        [ 2592000, "mon"], // 60 * 60 * 24 * 30
        [604800, "wk"],  //60 * 60 * 24 * 7
        [86400, "d"], //60 * 60 * 24
        [3600, "h"], //60 * 60 * 24
        [60, 'm'],
        [1, 's']
    ]

    for ( const [sec, label] of intervals) {
        const count = Math.floor(seconds/sec)
        if (count >= 1) return `${count}${label}`
    }
    return 'now'
}