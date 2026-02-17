
const checkCursor = () => {
    const body = document.querySelector('body');
    const cursornrml = getComputedStyle(body).cursor;
    console.log('Body cursor:', cursornrml);

    const btn = document.querySelector('button');
    const cursorpointe = getComputedStyle(btn).cursor;
    console.log('Button cursor:', cursorpointe);
};
// Run this in console to check
