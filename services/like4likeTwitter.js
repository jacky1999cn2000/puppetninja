'use strict';

const _ = require('lodash');
const utils = require('./utils');
const manager = require('./manager');

module.exports = {

  follow: async (page, browser, config) => {

    utils.log('like4likeTwitter:follow', 2);

    // go to twitter follower link
    await page.goto(config.like4like_twitter_follow_url, {
      waituntil: "networkidle0"
    });
    await page.waitFor(4000);

    // get span ids
    const ids = await page.evaluate(
      () => [...document.querySelectorAll('[id^="likebutton"]')]
      .map(element => element.getAttribute('id'))
      .filter(id => {
        let code = id.split('button')[1];
        return code.length == 5;
      })
    );

    // simply return if the page has no follows
    if (ids.length == 0) {
      return;
    }

    let randomInt = utils.getRandomInt(5) + 3; // 3-7
    if (randomInt > ids.length) {
      randomInt = ids.length;
    }
    // console.log('randomInt ', randomInt);

    for (let i = 0; i < ids.length; i++) {

      if (i == randomInt) {
        break;
      }

      // based on id, get follow button
      let followButton = '#' + ids[i] + ' > a';

      console.log('followButton ', followButton);

      let twitterpage = null;
      let followButtonClass = `#react-root > div.rn-1oszu61.rn-1efd50x.rn-14skgim.rn-rull8r.rn-mm0ijv.rn-13yce4e.rn-fnigne.rn-ndvcnb.rn-gxnn5r.rn-deolkf.rn-6koalj.rn-1qe8dj5.rn-1mlwlqe.rn-eqz5dr.rn-1pi2tsx.rn-1mnahxq.rn-61z16t.rn-p1pxzi.rn-11wrixw.rn-ifefl9.rn-bcqeeo.rn-wk8lta.rn-9aemit.rn-1mdbw0j.rn-gy4na3.rn-bnwqim.rn-13qz1uu.rn-1lgpqti > main > div > div.rn-1oszu61.rn-aqfbo4.rn-e84r5y.rn-1efd50x.rn-14skgim.rn-rull8r.rn-mm0ijv.rn-13yce4e.rn-fnigne.rn-ndvcnb.rn-gxnn5r.rn-deolkf.rn-6koalj.rn-1qe8dj5.rn-1mlwlqe.rn-eqz5dr.rn-16y2uox.rn-1mnahxq.rn-61z16t.rn-p1pxzi.rn-11wrixw.rn-ifefl9.rn-bcqeeo.rn-wk8lta.rn-9aemit.rn-1mdbw0j.rn-gy4na3.rn-bnwqim.rn-1lgpqti > div > div.rn-1oszu61.rn-14lw9ot.rn-1efd50x.rn-14skgim.rn-rull8r.rn-mm0ijv.rn-13yce4e.rn-fnigne.rn-ndvcnb.rn-gxnn5r.rn-deolkf.rn-6koalj.rn-1qe8dj5.rn-1iusvr4.rn-eqz5dr.rn-16xksha.rn-1mnahxq.rn-lchren.rn-p1pxzi.rn-1jj8364.rn-1ye8kvj.rn-ifefl9.rn-bcqeeo.rn-wk8lta.rn-9aemit.rn-1mdbw0j.rn-gy4na3.rn-bnwqim.rn-13qz1uu.rn-1lgpqti > div > div > div > div:nth-child(1) > div.rn-1oszu61.rn-1efd50x.rn-14skgim.rn-rull8r.rn-mm0ijv.rn-13yce4e.rn-fnigne.rn-ndvcnb.rn-gxnn5r.rn-deolkf.rn-6koalj.rn-1qe8dj5.rn-1mlwlqe.rn-eqz5dr.rn-1mnahxq.rn-61z16t.rn-p1pxzi.rn-11wrixw.rn-ifefl9.rn-bcqeeo.rn-1qfoi16.rn-1mdbw0j.rn-1hfyk0a.rn-m611by.rn-bnwqim.rn-1lgpqti > div.rn-obd0qt.rn-1efd50x.rn-14skgim.rn-rull8r.rn-mm0ijv.rn-13yce4e.rn-fnigne.rn-ndvcnb.rn-gxnn5r.rn-deolkf.rn-6koalj.rn-1qe8dj5.rn-1mlwlqe.rn-18u37iz.rn-1w6e6rj.rn-1wtj0ep.rn-1mnahxq.rn-61z16t.rn-p1pxzi.rn-11wrixw.rn-ifefl9.rn-bcqeeo.rn-wk8lta.rn-9aemit.rn-1mdbw0j.rn-gy4na3.rn-bnwqim.rn-1lgpqti > div > div.rn-1oszu61.rn-1efd50x.rn-14skgim.rn-rull8r.rn-mm0ijv.rn-13yce4e.rn-fnigne.rn-ndvcnb.rn-gxnn5r.rn-deolkf.rn-6koalj.rn-1qe8dj5.rn-1mlwlqe.rn-eqz5dr.rn-1mnahxq.rn-61z16t.rn-11wrixw.rn-15d164r.rn-ifefl9.rn-wk8lta.rn-9aemit.rn-1mdbw0j.rn-gy4na3.rn-bnwqim.rn-1lgpqti > div`;

      // click follow button, and capture the pop up new window
      await page.click(followButton);

      browser.on('targetcreated', async target => {

        if (target.url() !== 'about:blank') {

          try {
            twitterpage = await target.page();
            await twitterpage.waitFor(followButtonClass, {
              timeout: 1000
            });

            await twitterpage.click(followButtonClass);
            await twitterpage.waitFor(500);

            await twitterpage.close();
          } catch (e) {
            // console.log(e.name);
            // console.log(e.message);

            await twitterpage.close();
          }

        }

      });

      await page.waitFor(2000);

    } // for loop

    return;

  }, // follow method

  like: async (page, browser, config) => {

    utils.log('like4likeTwitter:like', 2);

    // go to twitter likes link
    await page.goto(config.like4like_twitter_like_url, {
      waituntil: "networkidle0"
    });
    await page.waitFor(4000);

    // get span ids
    const ids = await page.evaluate(
      () => [...document.querySelectorAll('[id^="likebutton"]')]
      .map(element => element.getAttribute('id'))
      .filter(id => {
        let code = id.split('button')[1];
        return code.length == 5;
      })
    );

    console.log('ids ', ids);
    // simply return if the page has no follows
    if (ids.length == 0) {
      return;
    }

    let randomInt = utils.getRandomInt(5) + 3; // 3-7
    if (randomInt > ids.length) {
      randomInt = ids.length;
    }
    console.log('randomInt ', randomInt);

    for (let i = 0; i < ids.length; i++) {

      if (i == randomInt) {
        break;
      }

      // based on id, get follow button
      let followButton = '#' + ids[i] + ' > a';

      console.log('followButton ', followButton);

      let twitterpage = null;

      // click follow button, and capture the pop up new window
      await page.click(followButton);

      browser.on('targetcreated', async target => {

        if (target.url() !== 'about:blank') {

          try {
            twitterpage = await target.page();
            await twitterpage.waitFor('#favorite_btn_form > fieldset > input', {
              timeout: 1000
            });

            await twitterpage.click('#favorite_btn_form > fieldset > input');
            // await twitterpage.waitFor(500);

            await twitterpage.close();
          } catch (e) {
            // console.log(e.name);
            // console.log(e.message);

            await twitterpage.close();
          }

        }

      });

      await page.waitFor(2000);

    } // for loop

    return;

  }, // like method

  retweet: async (page, browser, config) => {

    utils.log('youlikehitsTwitter:retweet', 2);

    // go to twitter retweets link
    await page.goto(config.youlikehits_twitter_retweets, {
      waituntil: "networkidle0"
    });

    // for some reason, there are 2 kinds of retweets links (.cardsp and .cards), so we query both and combine them together
    const cardpIds = await page.evaluate(
      () => [...document.querySelectorAll('.cardsp')]
      .map(element => element.getAttribute('id'))
    );

    const cardIds = await page.evaluate(
      () => [...document.querySelectorAll('.cards')]
      .map(element => element.getAttribute('id'))
    );

    const ids = cardpIds.concat(cardIds);

    // simply return if the page has no retweets
    if (ids.length == 0) {
      return;
    }

    const randomInt = utils.getRandomInt(3) + 2; // 2-4

    // get all iframes on the page, and filter for 'retweet' iframes
    const frames = await page.frames();

    const retweetframes = await frames.filter(frame => frame['_navigationURL'].indexOf('retweetrender') != -1);

    // get retweet & confirm buttons for each iframe
    let retweetButtons = [];
    let confirmButtons = [];

    for (let retweetframe of retweetframes) {
      let retweetButton = await retweetframe.$('body > center > a:nth-child(1)');
      let confirmButton = await retweetframe.$('body > center > a:nth-child(2)');

      retweetButtons.push(retweetButton);
      confirmButtons.push(confirmButton);
    }

    for (let i = 0; i < ids.length; i++) {

      if (i == randomInt) {
        break;
      }

      let twitterpage = null;
      let decision = 'RESET';
      let state = 'RESET';

      // click retweet button, and capture the pop up new window
      await retweetButtons[i].click();

      browser.on('targetcreated', async target => {

        if (target.url() !== 'about:blank') {

          // await utils.log(`retweeting: ${target.url()}`, 1);

          try {
            twitterpage = await target.page();
            await twitterpage.waitFor("#retweet_btn_form > fieldset > input", {
              timeout: 1000
            });

            await twitterpage.click('#retweet_btn_form > fieldset > input');
            await twitterpage.waitFor(1000);

            decision = 'CONFIRM';
            state = 'CONTINUE';

            await twitterpage.close();
          } catch (e) {
            // console.log(e.name);
            // console.log(e.message);

            // for "of null" error, we need to skip the item, and then restart the process;
            // for "timeout" error, we need to skip the item, and continue
            // otherwise, confirm and continue
            if (e.message.indexOf('\'close\' of null') != -1) {
              decision = 'SKIP';
              state = 'EXIT';
            } else if (e.message.indexOf('timeout') != -1) {
              decision = 'SKIP';
              state = 'CONTINUE';
            } else {
              decision = 'CONFIRM';
              state = 'CONTINUE';
            }
            await twitterpage.close();
          }

        }

      });

      await page.waitFor(2000);

      // console.log(decision);
      // console.log(state);

      if (decision == 'CONFIRM') {

        await confirmButtons[i].click();
        await page.waitFor(6000);

      } else {

        let skipLink = '#' + cardIds[i] + ' > center > font > a:nth-child(1)';
        await page.click(skipLink);
        await page.waitFor(4000);

        if (state == 'EXIT') {
          console.log('exit...');
          config['youlikehits_user' + config.whichyoulikehitsuser].twitter_preparation_done = false;
          manager.save(config);
          process.exit(1);
        }

      }

    } // for loop

    return;

  } // retweet method

}
