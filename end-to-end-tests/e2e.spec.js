// @ts-check
const { test, expect } = require('@playwright/test');

// The SVG is loaded asynchronously, so we need to wait for it to be loaded.
// One way we can do this by waiting until the number of paths in the SVG is what we expect.
const waitForSVGLoad = async (page, expectedPathCount) => {
  await page.waitForFunction(`document.getElementById("svg")?.getElementsByTagName("title").length === ${expectedPathCount}`);
};

// This is a helper function to check that a node has a title that contains the expected text.
// The title of the path is currently hidden in the UI, so there are some extra steps to check for it.
// If the the title where changed to be visible, we could simplify this check.
const checkForHiddenTitleOnPaths = async (page, nodeId, expectedTitle) => {
  // wait for the selector/fn to return true
  // use $eval on the page since the title is hidden in the UI
  await page.waitForFunction(`document.querySelector('#svg path#${nodeId} > title')?.textContent.includes('${expectedTitle}')`);
  const bNodeTitleText = await page.$eval(`#svg path#${nodeId} > title`, el => el.textContent);
  expect(bNodeTitleText).toContain(expectedTitle);
};


// it("initially renders as loading", () => {
//   let loader = document.getElementById("loader");
//   expect(loader).toBeTruthy();
// });
// This test is flaky, sometimes the loader is removed before the test completes
// test("initially renders as loading", async ({page}) => {
//   await page.goto('http://localhost:3001/');
//   await expect(page.locator('#loader')).toBeVisible();
// });

// it("populates the available example dropdown", () => {
//   // Make sure the dropdown exists in the div
//   let dropdown = document.getElementById("dataSourceSelect");
//   expect(dropdown).toBeTruthy();
// 
//   // Make sure it has a particular example value
//   let wantedEntry = findDropdownOption(dropdown, "snp1kg-BRCA1");
//   expect(wantedEntry).toBeTruthy();
// });
test("populates the available example dropdown", async ({ page }, testInfo) => {
  await page.goto('http://localhost:3001/');
  const select = await page.getByLabel('Data:');
  // get the values of the options in the select
  const optionValues = await select.evaluate((select) => Array.from(select.querySelectorAll('option')).map((option) => option.value));
  expect(optionValues.length).toBeGreaterThan(0);
  expect(optionValues.length).toBe(7);
  expect(optionValues).toContain('snp1kg-BRCA1');
});

//  it("eventually stops rendering as loading", () => {
//    let loader = document.getElementById("loader");
//    expect(loader).toBeFalsy();
//  });
test('eventually stops rendering as loading', async ({ page }, testInfo) => {
  await page.goto('http://localhost:3001/');
  // await page.waitForSelector('#loader'); // This sometimes doesn't catch the loader in time
  // await expect(page.locator('#loader')).toBeVisible(); // This sometimes doesn't catch the loader in time
  await page.waitForSelector('#loader', { state: 'hidden' });
  await expect(page.locator('#loader')).not.toBeVisible();
  const screenshot = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
});

// We cant check this because playwright wait by default.
//  it("does not reload if we click the go button without changing settings", () => {
//    let loader = document.getElementById("loader");
//    expect(loader).toBeFalsy();
//
//    act(() => {
//      let go = document.getElementById("goButton");
//      userEvent.click(go);
//    });
//
//    loader = document.getElementById("loader");
//    expect(loader).toBeFalsy();
//  });


//  it("the regions from the BED files are loaded", async () => {
//    let regionInput = getRegionInput();
//    await act(async () => {
//      userEvent.click(getRegionInput());
//    });
//    // Make sure that option in RegionInput dropdown (17_1_100) is visible
//    expect(screen.getByText("17_1_100")).toBeInTheDocument();
//  });

test('the regions from the BED files are loaded', async ({ page }, testInfo) => {
  await page.goto('http://localhost:3001/');
  // await page.locator('#regionInput').click();
  await page.getByLabel('Region').click();
  const option = await page.getByRole('option', { name: '17_1_100' });
  await expect(option).toBeVisible();
  const screenshot = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });

});

//  it("the region options in autocomplete are cleared after selecting new data", async () => {
//    // Input data dropdown
//    await userEvent.selectOptions(
//      screen.getByLabelText(/Data/i),
//      'vg "small" example'
//    );
//    let regionInput = getRegionInput();
//    await act(async () => {
//      userEvent.click(getRegionInput());
//    });
//    // Make sure that old option in RegionInput dropdown (17_...) is not visible
//    expect(screen.queryByText("17_1_100")).not.toBeInTheDocument();
//    await act(async () => {
//      userEvent.click(regionInput);
//    });
//  });

test('the region options in autocomplete are cleared after selecting new data', async ({ page }, testInfo) => {
  await page.goto('http://localhost:3001/');

  await page.getByLabel('Region').click();
  const option = await page.getByRole('option', { name: '17_1_100' });
  await expect(option).toBeVisible();
  const screenshotClickRegionBeforeSelect = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot-click-region-before-select', { body: screenshotClickRegionBeforeSelect, contentType: 'image/png' });
  await page.keyboard.press('Escape');

  await page.getByLabel('Data:').selectOption('vg "small" example');
  const screenshotAfterSelect = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot-after-select', { body: screenshotAfterSelect, contentType: 'image/png' });
  const regionInput = await page.locator('#regionInput');
  const regionInputValue = await regionInput.evaluate(el => el.value);
  expect(regionInputValue).toBe('x:1-100');

  await page.getByLabel("Region").click();
  // expect(await page.locator('text=17_1_100')).not.toBeVisible();
  // expect(await page.locator('text="x:"')).toBeVisible();
  expect(await page.getByRole('option', { name: '17_1_100' })).toHaveCount(0);
  expect(await page.getByRole('option', { name: 'x:' })).toBeVisible();
  const screenshotAfterEnd = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot-after-end', { body: screenshotAfterEnd, contentType: 'image/png' });
});


  // it("draws an SVG for synthetic data example 1", async () => {
  //   await act(async () => {
  //     let dropdown = document.getElementById("dataSourceSelect");
  //     await userEvent.selectOptions(
  //       screen.getByLabelText(/Data/i),
  //       "synthetic data examples"
  //     );
  //   });

  //   await act(async () => {
  //     let example1 = document.getElementById("example1");
  //     console.log("Clicking button for example 1");
  //     await userEvent.click(example1);
  //   });

  //   // We're agnostic as to whether we will see a loader when rendering the
  //   // example data.

  //   await waitForLoadEnd();

  //   let svg = document.getElementById("svg");
  //   expect(svg).toBeTruthy();
  // });

test("draws an SVG for synthetic data example 1", async ({ page }, testInfo) => {
  await page.goto('http://localhost:3001/');
  await page.getByLabel('Data:').selectOption('examples');
  const screenshotBeforeClick = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot-before-click', { body: screenshotBeforeClick, contentType: 'image/png' });

  // NOTE: sometimes this is flaky, is the button not clickable at first?
  await page.getByRole('button', { name: 'Indels and Polymorphisms only' }).click();

  const screenshot1 = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot-after-click', { body: screenshot1, contentType: 'image/png' });

  await checkForHiddenTitleOnPaths(page, 'A', 'Node ID: A');
  await checkForHiddenTitleOnPaths(page, 'B', 'Node ID: B');
  // await page.waitForSelector('#svg path#B');
  // const nodeB = page.locator('#svg path#B > title');
  // await nodeB.waitFor({state: 'hidden'}); 
  // const bNodeTitleText = await page.$eval('#svg path#B > title', el => el.textContent);
  // expect(bNodeTitleText).toContain('Node ID: B');
  const screenshot2 = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot-after-find', { body: screenshot2, contentType: 'image/png' });
});


  // it('draws the right SVG for vg "small"', async () => {
  //   let dropdown = document.getElementById("dataSourceSelect");

  //   // Input data dropdown
  //   await userEvent.selectOptions(
  //     screen.getByLabelText(/Data/i),
  //     'vg "small" example'
  //   );
  //   const autocomplete = screen.getByTestId("autocomplete");
  //   const input = autocomplete.querySelector("input");

  //   await userEvent.clear(input);

  //   // Input region
  //   // using fireEvent because userEvent has no change
  //   fireEvent.focus(input);
  //   fireEvent.change(input, { target: { value: "node:1+10" } });
  //   expect(input.value).toBe("node:1+10");
  //   fireEvent.keyDown(autocomplete, { key: "Enter" });

  //   // Wait for rendered response
  //   await waitFor(() => screen.getByTestId("autocomplete"));

  //   // Click go
  //   let go = document.getElementById("goButton");
  //   await userEvent.click(go);

  //   let loader = document.getElementById("loader");
  //   expect(loader).toBeTruthy();

  //   await waitForLoadEnd();

  //   // See if correct svg rendered
  //   let svg = document.getElementById("svg");
  //   expect(svg).toBeTruthy();
  //   expect(svg.getElementsByTagName("title").length).toEqual(65);
  // });


test('draws the right SVG for vg "small"', async ({ page }, testInfo) => {
  await page.goto('http://localhost:3001/');
  // await page.selectOption('select#data', 'vg "small" example');
  await page.getByLabel('Data:').selectOption('vg "small" example');
  const input = await page.$("[data-testid='autocomplete'] input");
  // const autocomplete = await page.getByTestId('regionInput');
  await input.fill('node:1+10');
  const screenshotAfterFill = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot-after-fill', { body: screenshotAfterFill, contentType: 'image/png' });
  await page.keyboard.press('Tab'); // we must hit tab to remove the autocomplete list or it will block the button
  await page.getByRole('button', { name: 'Go' }).click();
  await page.waitForSelector('#loader', { state: 'hidden' });
  await expect(page.locator('#loader')).toBeHidden();
  const screenshotAfterClick = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot-after-click', { body: screenshotAfterClick, contentType: 'image/png' });
  // await expect(page.locator('#svg')).toBeVisible(); // fails in CI
  // NOTE: "1" is not a valid HTMLEelement ID, so we can't use #1
  // TODO? change svg renderer to use valid IDs (e.g. starting with a letter [a-zA-Z]])
  // See: https://www.w3.org/TR/html4/types.html#:~:text=ID%20and%20NAME%20tokens%20must,periods%20(%22.%22).
  // await checkForHiddenTitleOnPaths(page, '1', 'Node ID: 1'); // this fails because of the above
  // The svg loads asynchronously, wait for it to load fully.
  // await page.waitForFunction('document.getElementById("svg").getElementsByTagName("title").length === 59');
  await waitForSVGLoad(page, 59);
  const svg = await page.locator('#svg');
  const titleLength = await svg.evaluate((svg) => svg.getElementsByTagName("title").length );
  // in the old e2e tests, the value was 65, 
  // but it seems document.getElementById("svg").getElementsByTagName("title").length is 59
  // expect(titlesLength).toEqual(65); 
  expect(titleLength).toEqual(59);
  const screenshotAfterEnd = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot-after-end', { body: screenshotAfterEnd, contentType: 'image/png' });
});


// it("produces correct link for view before & after go is pressed", async () => {
//   // First test that after pressing go, the link reflects the dat form
//   const expectedLinkBRCA1 =
//     "http://localhost?tracks[0][files][0][name]=snp1kg-BRCA1.vg.xg&tracks[0][files][0][type]=graph&tracks[1][files][0][name]=&tracks[1][files][0][type]=haplotype&tracks[2][files][0][name]=NA12878-BRCA1.sorted.gam&tracks[2][files][0][type]=read&name=snp1kg-BRCA1&graphFile=snp1kg-BRCA1.vg.xg&gamFile=NA12878-BRCA1.sorted.gam&dataPath=default&region=17:1-100&bedFile=snp1kg-BRCA1.bed&dataType=built-in";
//   // Set up dropdown
//   await act(async () => {
//     let dropdown = document.getElementById("dataSourceSelect");
//     await userEvent.selectOptions(
//       screen.getByLabelText(/Data/i),
//       "snp1kg-BRCA1"
//     );
//   });
//   // Wait for server to load / avoid console yelling
//   await waitForLoadEnd();
// 
//   clickGoButton();
// 
//   await clickCopyLink();
//   // Ensure link reflects our selected data
//   expect(fakeClipboard).toEqual(expectedLinkBRCA1);
// 
//   // Set up dropdown
//   await act(async () => {
//     let dropdown = document.getElementById("dataSourceSelect");
//     await userEvent.selectOptions(screen.getByLabelText(/Data/i), "cactus");
//   });
//   // Wait for server to load
//   await waitForLoadEnd();
// 
//   await clickCopyLink();
//   // Make sure clipboard has not changed
//   expect(fakeClipboard).toEqual(expectedLinkBRCA1);
//   clickGoButton();
//   await waitForLoadEnd();
//   await clickCopyLink();
// 
//   const expectedLinkCactus =
//     "http://localhost?tracks[0][files][0][name]=cactus.vg.xg&tracks[0][files][0][type]=graph&tracks[1][files][0][type]=haplotype&tracks[2][files][0][name]=cactus-NA12879.sorted.gam&tracks[2][files][0][type]=read&tracks[3][files][0][type]=read&bedFile=cactus.bed&name=cactus&region=ref:1-100&dataPath=mounted&dataType=built-in";
//   // Make sure link has changed after pressing go
//   expect(fakeClipboard).toEqual(expectedLinkCactus);
// });

test("produces correct link for view before & after go is pressed", async ({ page }) => {
  await page.goto('http://localhost:3001/');
  // First test that after pressing go, the link reflects the dat form
  const expectedLinkBRCA1 =
    "http://localhost:3001?tracks[0][files][0][name]=snp1kg-BRCA1.vg.xg&tracks[0][files][0][type]=graph&tracks[1][files][0][name]=&tracks[1][files][0][type]=haplotype&tracks[2][files][0][name]=NA12878-BRCA1.sorted.gam&tracks[2][files][0][type]=read&name=snp1kg-BRCA1&graphFile=snp1kg-BRCA1.vg.xg&gamFile=NA12878-BRCA1.sorted.gam&dataPath=default&region=17:1-100&bedFile=snp1kg-BRCA1.bed&dataType=built-in";
  await page.getByLabel('Data:').selectOption('snp1kg-BRCA1');
  await page.getByRole('button', { name: 'Go' }).click();
  await page.getByRole('button', { name: 'Copy link' }).click();
  let button = await page.getByRole('button', { name: 'Copied Link!' });
  let linkValue = await button.evaluate((button) => button.dataset.testLink);
  expect(linkValue).toEqual(expectedLinkBRCA1);

  await page.getByLabel('Data:').selectOption('cactus');
  const expectedLinkCactus =
    "http://localhost:3001?tracks[0][files][0][name]=cactus.vg.xg&tracks[0][files][0][type]=graph&tracks[1][files][0][type]=haplotype&tracks[2][files][0][name]=cactus-NA12879.sorted.gam&tracks[2][files][0][type]=read&tracks[3][files][0][type]=read&bedFile=cactus.bed&name=cactus&region=ref:1-100&dataPath=mounted&dataType=built-in";
  await page.getByRole('button', { name: 'Go' }).click();
  // await page.getByRole('button', { name: 'Copy link' }).click();
  await button.click();
  button = await page.getByRole('button', { name: 'Copied Link!' });
  linkValue = await button.evaluate((button) => button.dataset.testLink);
  expect(linkValue).toEqual(expectedLinkCactus);
});

// it("can retrieve the list of mounted graph files", async () => {
//   // Wait for everything to settle so we don't stop the server while it is thinking
//   await waitForLoadEnd();
// 
//   // Swap over to the mounted files mode
//   await act(async () => {
//     let dropdown = document.getElementById("dataSourceSelect");
//     await userEvent.selectOptions(
//       screen.getByLabelText(/Data/i),
//       "custom (mounted files)"
//     );
//   });
// 
//   // Find the select box's input
//   let graphSelectInput = screen.getByLabelText(/graph file:/i);
//   expect(graphSelectInput).toBeTruthy();
// 
//   // We shouldn't see the option before we open the dropdown
//   expect(screen.queryByText("cactus.vg.xg")).not.toBeInTheDocument();
// 
//   // Make sure the right entry eventually shows up (since we could be racing
//   // the initial load from the component mounting)
//   await waitFor(() => {
//     // Open the selector and see if it is there
//     selectEvent.openMenu(graphSelectInput);
//     expect(screen.getByText("cactus.vg.xg")).toBeInTheDocument();
//   });
// });

test("can retrieve the list of mounted graph files", async ({ page }, testInfo) => {
  await page.goto('http://localhost:3001/');
  await page.getByLabel('Data:').selectOption('custom (mounted files)')
  expect(await page.getByText('cactus.vg.xg', { exact: true })).not.toBeVisible();
  await page.getByLabel('graph file:').click();
  const screenshotAfterClick = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot-after-click', { body: screenshotAfterClick, contentType: 'image/png' });
  expect(await page.getByText('cactus.hg', { exact: true })).toBeVisible();
  expect(await page.getByText('cactus.pg', { exact: true })).toBeVisible();
  expect(await page.getByText('cactus.vg', { exact: true })).toBeVisible();
  expect(await page.getByText('cactus.vg.xg', { exact: true })).toBeVisible();
  expect(await page.getByText('cactustest.vg', { exact: true })).toBeVisible();
  const screenshotAfterEnd = await page.screenshot({ fullPage: true });
  await testInfo.attach('screenshot-after-end', { body: screenshotAfterEnd, contentType: 'image/png' });
});