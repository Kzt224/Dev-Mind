

 export const calculateNotiLength = (item) => {
        if (!item) return;
        const unRead = item?.filter(i => !i.read);
        const maxLength = 10;
        let length = 0;
        if (unRead.length < 0) {
            length = ''
        } else if (unRead.length > maxLength) {
            length = maxLength.toString() + '+';
        } else {
            length = unRead.length
        }
        return length;
    }