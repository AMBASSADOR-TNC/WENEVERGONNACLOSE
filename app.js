const links=[...document.querySelectorAll('[data-branch]')];
const store=document.querySelector('#branch-store');
const stores={
  awd:['Explore Whole Donuts','#awd'],
  tnc:['Explore The Nurtured Chef','#tnc']
};
const reviewQueueList=document.querySelector('#review-queue-list');
const reviewQueueExclusions=document.querySelector('#review-queue-exclusions');
const reviewQueueFilter=document.querySelector('#review-queue-filter');
const reviewQueueStatus=document.querySelector('#review-queue-status');
const reviewQueueManifest=Array.isArray(window.WHNUTZ_REVIEW_QUEUE_MANIFEST)?window.WHNUTZ_REVIEW_QUEUE_MANIFEST:[];
const reviewQueueExclusionManifest=Array.isArray(window.WHNUTZ_REVIEW_QUEUE_EXCLUSIONS)?window.WHNUTZ_REVIEW_QUEUE_EXCLUSIONS:[];
const reviewQueueCategories=['draft','image','crumb'];

function validReviewCandidate(candidate){
  return candidate
    &&typeof candidate.title==='string'
    &&typeof candidate.source==='string'
    &&reviewQueueCategories.includes(candidate.category)
    &&typeof candidate.provenance==='string'
    &&typeof candidate.rights==='string'
    &&typeof candidate.reviewStatus==='string'
    &&typeof candidate.nextStep==='string';
}

function reviewQueueDetail(label,value){
  const detail=document.createElement('p');
  const heading=document.createElement('strong');
  heading.textContent=label+': ';
  detail.append(heading,value);
  return detail;
}

const LOCAL_CRUMBS_KEY='plusu-local-crumbs';
const JOURNEY_KEY='plusu-journey';

function readLocalCrumbs(){
  try{
    const raw=localStorage.getItem(LOCAL_CRUMBS_KEY);
    const parsed=raw?JSON.parse(raw):[];
    return Array.isArray(parsed)?parsed.filter(item=>item&&typeof item.content==='string'):[]; 
  }catch(e){
    return [];
  }
}
function saveLocalCrumb(crumb){
  try{
    const crumbs=readLocalCrumbs();
    crumbs.unshift(crumb);
    localStorage.setItem(LOCAL_CRUMBS_KEY,JSON.stringify(crumbs.slice(0,50)));
    return true;
  }catch(e){
    return false;
  }
}
function clearLocalCrumbs(){
  try{localStorage.removeItem(LOCAL_CRUMBS_KEY);}catch(e){}
}

function localCrumbCandidates(){
  return readLocalCrumbs().map(crumb=>({
    title:'Your saved crumb: '+(crumb.category||'a useful note'),
    source:crumb.source||'Written on this device',
    category:'crumb',
    provenance:'Saved on this device only; never sent anywhere',
    rights:'Your own words; you confirmed you wrote it or have permission',
    reviewStatus:'Awaiting human review',
    nextStep:'A human reviews it before anything is published.'
  }));
}

function renderReviewQueue(){
  if(!reviewQueueList)return;
  const category=reviewQueueFilter?reviewQueueFilter.value:'all';
  const candidates=[...localCrumbCandidates(),...reviewQueueManifest.filter(validReviewCandidate)].filter(candidate=>category==='all'||candidate.category===category);
  reviewQueueList.replaceChildren();
  candidates.forEach(candidate=>{
    const card=document.createElement('article');
    const title=document.createElement('h4');
    title.textContent=candidate.title;
    card.className='review-candidate';
    card.append(
      title,
      reviewQueueDetail('Source reference',candidate.source),
      reviewQueueDetail('Category',candidate.category),
      reviewQueueDetail('Provenance',candidate.provenance),
      reviewQueueDetail('Rights status',candidate.rights),
      reviewQueueDetail('Review status',candidate.reviewStatus),
      reviewQueueDetail('Manual next step',candidate.nextStep)
    );
    reviewQueueList.append(card);
  });
  if(reviewQueueStatus)reviewQueueStatus.textContent=candidates.length+' review-only '+(candidates.length===1?'candidate is':'candidates are')+' shown. No action is automatic.';
}

function renderReviewQueueExclusions(){
  if(!reviewQueueExclusions)return;
  const exclusions=reviewQueueExclusionManifest.filter(item=>item&&typeof item.source==='string'&&typeof item.reviewStatus==='string'&&typeof item.reason==='string');
  reviewQueueExclusions.replaceChildren();
  exclusions.forEach(item=>{
    const card=document.createElement('article');
    const title=document.createElement('h4');
    title.textContent=item.source;
    card.className='review-candidate review-candidate-excluded';
    card.append(
      title,
      reviewQueueDetail('Source status',item.reviewStatus),
      reviewQueueDetail('Reason',item.reason)
    );
    reviewQueueExclusions.append(card);
  });
}

if(reviewQueueFilter)reviewQueueFilter.addEventListener('change',renderReviewQueue);
renderReviewQueue();
renderReviewQueueExclusions();

// Crumb Saver: local-only. A visitor's crumb is saved on their own device
// and shown in the review queue above as a browser-only candidate. Nothing
// is sent anywhere, and nothing is published until a human reviews it.
const crumbForm=document.querySelector('#crumb-form');
const crumbStatus=document.querySelector('#crumb-status');
const crumbContent=document.querySelector('#crumb-content');
const crumbCategory=document.querySelector('#crumb-category');
const crumbSource=document.querySelector('#crumb-source');
const crumbRights=document.querySelector('#crumb-rights');
if(crumbForm){
  crumbForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const content=crumbContent?crumbContent.value.trim():'';
    if(!content){
      if(crumbStatus)crumbStatus.textContent='Write your crumb first — what is useful, who could it help, and how should someone begin?';
      if(crumbContent)crumbContent.focus();
      return;
    }
    if(crumbRights&&!crumbRights.checked){
      if(crumbStatus)crumbStatus.textContent='Please confirm you wrote this or have permission to share it.';
      crumbRights.focus();
      return;
    }
    const saved=saveLocalCrumb({
      content,
      category:crumbCategory?crumbCategory.value:'',
      source:crumbSource?crumbSource.value.trim():'',
      savedAt:new Date().toISOString()
    });
    if(saved){
      if(crumbStatus)crumbStatus.textContent='Saved on this device only. It is in the review queue below as a browser-only candidate — nothing was sent anywhere, and a human reviews it before anything is published.';
      crumbForm.reset();
      renderReviewQueue();
    }else{
      if(crumbStatus)crumbStatus.textContent='This browser could not save the crumb. Copy your words somewhere safe and try again.';
    }
  });
  const clearCrumbsButton=document.createElement('button');
  clearCrumbsButton.type='button';
  clearCrumbsButton.textContent='Clear the crumbs I saved on this device';
  clearCrumbsButton.addEventListener('click',()=>{
    clearLocalCrumbs();
    renderReviewQueue();
    if(crumbStatus)crumbStatus.textContent='Your saved crumbs were cleared from this device.';
  });
  if(crumbStatus)crumbStatus.after(clearCrumbsButton);
}

const donationPurposeInputs=[...document.querySelectorAll('input[name="donation-purpose"]')];
const donationDisclosure=document.querySelector('#donation-disclosure');
const donationConfirmation=document.querySelector('#donation-confirmation');
const revealDonationLink=document.querySelector('#reveal-donation-link');
const donationExit=document.querySelector('#donation-exit');
const donationExitCopy=document.querySelector('#donation-exit-copy');
const donationProcessorLink=document.querySelector('#donation-processor-link');
const donationStatus=document.querySelector('#donation-status');
const donationProcessorUrl='https://cash.app/$wholedonuts';
const chimeSign='$wholedonuts';
const copyChimeSignButton=document.querySelector('#copy-chime-sign');
const chimeCopyStatus=document.querySelector('#chime-copy-status');
const shareInvitationButton=document.querySelector('#share-invitation');
const copyInvitationButton=document.querySelector('#copy-invitation');
const shareInvitationStatus=document.querySelector('#share-invitation-status');
const invitationUrl='https://wenevergonnaclose.com/';

async function copyText(value){
  if(navigator.clipboard&&navigator.clipboard.writeText){
    try{
      await navigator.clipboard.writeText(value);
      return true;
    }catch(e){
      // Fall through to the browser's legacy local copy command.
    }
  }
  const copyField=document.createElement('textarea');
  try{
    copyField.value=value;
    copyField.setAttribute('readonly','');
    copyField.style.position='fixed';
    copyField.style.opacity='0';
    document.body.append(copyField);
    copyField.select();
    return document.execCommand('copy');
  }catch(e){
    return false;
  }finally{
    copyField.remove();
  }
}

function selectedDonationPurpose(){
  const selected=donationPurposeInputs.find(input=>input.checked);
  return selected?selected.value:null;
}

function resetDonationExit(){
  if(donationExit)donationExit.hidden=true;
  if(copyChimeSignButton)copyChimeSignButton.disabled=true;
  if(chimeCopyStatus)chimeCopyStatus.textContent='';
}

function syncDonationHub(){
  const purpose=selectedDonationPurpose();
  if(donationDisclosure)donationDisclosure.hidden=!purpose;
  if(donationConfirmation)donationConfirmation.checked=false;
  if(revealDonationLink)revealDonationLink.disabled=true;
  resetDonationExit();
  if(donationStatus)donationStatus.textContent=purpose
    ?'You selected '+purpose+'. Review the payee and affirm the final action to reveal the optional payment link.'
    :'Choose a purpose to review the optional payment details.';
}

donationPurposeInputs.forEach(input=>input.addEventListener('change',syncDonationHub));
if(donationConfirmation)donationConfirmation.addEventListener('change',()=>{
  if(revealDonationLink)revealDonationLink.disabled=!donationConfirmation.checked||!selectedDonationPurpose();
  resetDonationExit();
});
if(revealDonationLink)revealDonationLink.addEventListener('click',()=>{
  const purpose=selectedDonationPurpose();
  if(!purpose||!donationConfirmation||!donationConfirmation.checked){
    if(donationStatus)donationStatus.textContent='Choose a purpose and affirm the final action before continuing.';
    return;
  }
  if(donationProcessorLink)donationProcessorLink.href=donationProcessorUrl;
  if(donationExit)donationExit.hidden=false;
  if(copyChimeSignButton)copyChimeSignButton.disabled=false;
  if(donationExitCopy)donationExitCopy.textContent='You selected '+purpose+'. Cash App and Chime to $wholedonuts are optional manual choices shown before you leave this site.';
  if(donationStatus)donationStatus.textContent='The optional manual choices are ready. Nothing has been paid, transferred, or scheduled.';
  if(donationProcessorLink)donationProcessorLink.focus();
});

if(copyChimeSignButton)copyChimeSignButton.addEventListener('click',async()=>{
  if(copyChimeSignButton.disabled)return;
  if(await copyText(chimeSign)){
    if(chimeCopyStatus)chimeCopyStatus.textContent='$wholedonuts copied for manual entry in the official Chime app. Copying does not initiate a payment or transfer.';
  }else{
    if(chimeCopyStatus)chimeCopyStatus.textContent='The ChimeSign could not be copied. Enter $wholedonuts manually in the official Chime app. Copying does not initiate a payment or transfer.';
  }
});

function setShareInvitationStatus(message){
  if(shareInvitationStatus)shareInvitationStatus.textContent=message;
}

async function copyInvitation(){
  if(await copyText(invitationUrl)){
    setShareInvitationStatus('Invitation link copied. It contains no personal or referral information.');
  }else{
    setShareInvitationStatus('The invitation link could not be copied. You can share https://wenevergonnaclose.com/ directly.');
  }
}

if(copyInvitationButton)copyInvitationButton.addEventListener('click',()=>{
  copyInvitation();
});
if(shareInvitationButton)shareInvitationButton.addEventListener('click',async()=>{
  if(!navigator.share){
    // No native share sheet on this device: fall back to copying the link.
    copyInvitation();
    return;
  }
  try{
    await navigator.share({
      title:'+U Movement',
      text:'Every crumb becomes part of the whole. Join the +U table.',
      url:invitationUrl
    });
    setShareInvitationStatus('Invitation shared. No recipient, referral, reward, or payment record was created.');
  }catch(e){
    setShareInvitationStatus('Sharing was closed. No invitation, payment, referral, or reward record was created.');
  }
});

const journeySteps=[...document.querySelectorAll('[data-journey-step]')];
const journeyTitle=document.querySelector('#entry-journey-title');
const journeyProgress=document.querySelector('#entry-progress');
const journeyBack=document.querySelector('#journey-back');
const journeyRestart=document.querySelector('#journey-restart');
const journeyCompanions=[...document.querySelectorAll('.journey-companion')];
const journeyDestinationStatus=document.querySelector('#journey-destination-status');
const journeyTitles={
  1:'Choose a broad age range.',
  2:'Choose a face for this moment.',
  3:'Choose what would help most.',
  4:'Choose where to try first.'
};
const journeyVariants={
  youth:['style-curious','style-bright','style-brave','style-playful','style-inventive','style-steady','style-hopeful','style-friendly','style-focused','style-growing','style-open','style-gentle','style-ready','style-explorer'],
  adult:['style-grounded','style-reflective','style-resourceful','style-creative','style-patient','style-capable','style-courageous','style-welcoming','style-practical','style-forward','style-prepared','style-determined','style-connected','style-purposeful']
};
const journeyState={side:null,face:null,need:null,step:1};

// The journey is tracked only on this device, so the visit can pick up
// where it left off and the Leave screen can offer the correct store.
// Nothing is sent anywhere.
function saveJourney(){
  try{
    localStorage.setItem(JOURNEY_KEY,JSON.stringify({side:journeyState.side,face:journeyState.face,need:journeyState.need}));
  }catch(e){}
}
function loadJourney(){
  try{
    const raw=localStorage.getItem(JOURNEY_KEY);
    const parsed=raw?JSON.parse(raw):null;
    if(parsed&&typeof parsed==='object')return parsed;
  }catch(e){}
  return {};
}
function recordVisit(screen){
  try{
    const raw=localStorage.getItem('plusu-visited');
    const visited=raw?JSON.parse(raw):[];
    const list=Array.isArray(visited)?visited:[];
    if(!list.includes(screen))list.push(screen);
    localStorage.setItem('plusu-visited',JSON.stringify(list.slice(-20)));
  }catch(e){}
}

function setJourneyCompanion(){
  if(!journeyState.side)return;
  const variant=journeyVariants[journeyState.side][Math.max(0,journeyState.step-2)%journeyVariants[journeyState.side].length];
  journeyCompanions.forEach(companion=>companion.className='journey-companion entry-variant '+variant);
}

function showJourneyStep(step,{focus=false}={}){
  journeyState.step=step;
  journeySteps.forEach(item=>item.hidden=Number(item.dataset.journeyStep)!==step);
  if(journeyProgress)journeyProgress.textContent='STEP '+step+' OF 4';
  if(journeyTitle)journeyTitle.textContent=journeyTitles[step];
  if(journeyBack)journeyBack.hidden=step===1;
  setJourneyCompanion();
  if(focus){
    const activeStep=journeySteps.find(item=>Number(item.dataset.journeyStep)===step);
    const choice=activeStep?activeStep.querySelector('button'):null;
    if(choice)choice.focus();
  }
}

function restartJourney({focus=false}={}){
  journeyState.side=null;
  journeyState.face=null;
  journeyState.need=null;
  showJourneyStep(1,{focus});
}

document.querySelectorAll('[data-entry-side]').forEach(button=>button.addEventListener('click',()=>{
  journeyState.side=button.dataset.entrySide;
  saveJourney();
  showJourneyStep(2,{focus:true});
}));
document.querySelectorAll('[data-entry-face]').forEach(button=>button.addEventListener('click',()=>{
  journeyState.face=button.dataset.entryFace;
  saveJourney();
  showJourneyStep(3,{focus:true});
}));
document.querySelectorAll('[data-entry-need]').forEach(button=>button.addEventListener('click',()=>{
  journeyState.need=button.dataset.entryNeed;
  saveJourney();
  showJourneyStep(4,{focus:true});
}));
document.querySelectorAll('[data-entry-destination]').forEach(button=>button.addEventListener('click',()=>{
  const target=document.getElementById(button.dataset.entryDestination);
  if(!target)return;
  if(journeyDestinationStatus){
    journeyDestinationStatus.textContent=button.dataset.entryMessage;
    journeyDestinationStatus.hidden=false;
  }
  saveJourney();
  restartJourney();
  location.hash=button.dataset.entryDestination;
}));
if(journeyBack)journeyBack.addEventListener('click',()=>{
  if(journeyState.step===2)journeyState.side=null;
  if(journeyState.step===3)journeyState.face=null;
  if(journeyState.step===4)journeyState.need=null;
  showJourneyStep(journeyState.step-1,{focus:true});
});
if(journeyRestart)journeyRestart.addEventListener('click',()=>restartJourney({focus:true}));
document.querySelectorAll('.journey-actions a').forEach(link=>link.addEventListener('click',()=>restartJourney()));
showJourneyStep(1);

// ---- One-screen router: one screen at a time, everything else hidden. ----
const screens=[...document.querySelectorAll('[data-screen]')];
const screenLinks=[...document.querySelectorAll('[data-screen-link]')];
const ROUTES={
  '':'gateway','gateway':'gateway',
  'the-table':'table','table':'table','ambassador-path':'table',
  'template-library':'library','crumb-workshop':'library','review-queue':'library',
  'donation-access-hub':'counter','donuts-new-school':'counter','community-counter':'counter','the-counter':'counter',
  'menu':'menu','course-bits':'menu','course-bites':'menu','course-biggies':'menu','course-bombs':'menu',
  'sides':'sides','awd':'sides','tnc':'sides',
  'leave':'leave'
};
const COURSE_BY_HASH={'course-bits':'bits','course-bites':'bites','course-biggies':'biggies','course-bombs':'bombs'};

function routeFromHash(){
  return ROUTES[location.hash.slice(1)]||'gateway';
}

function showScreen(screen,{focus=false}={}){
  const id=location.hash.slice(1);
  const current=ROUTES[id]||screen||'gateway';
  if(id)restartJourney();
  screens.forEach(el=>{
    el.classList.toggle('screen-active',el.dataset.screen===current);
  });
  screenLinks.forEach(a=>{
    a.classList.toggle('active',a.dataset.screenLink===current);
  });
  links.forEach(a=>a.classList.toggle('active',a.dataset.branch===id));
  if(store){store.textContent='Return to the +U gateway';store.href='#gateway'}
  const course=COURSE_BY_HASH[id];
  if(course)openCourse(course);
  // A journey destination message travels with the visitor to their screen.
  if(journeyDestinationStatus&&!journeyDestinationStatus.hidden){
    const activeScreen=screens.find(el=>el.dataset.screen===current);
    if(activeScreen&&journeyDestinationStatus.parentElement!==activeScreen){
      activeScreen.prepend(journeyDestinationStatus);
    }
  }
  recordVisit(current);
  if(current==='leave')renderLeave();
  if(focus){
    const activeScreen=screens.find(el=>el.dataset.screen===current);
    if(activeScreen){
      activeScreen.tabIndex=-1;
      if(typeof activeScreen.scrollIntoView==='function')activeScreen.scrollIntoView({behavior:'smooth',block:'start'});
      activeScreen.focus({preventScroll:true});
    }
  }
}

const menuButtons=[...document.querySelectorAll('[data-menu]')];
const menuPanels=[...document.querySelectorAll('[data-course]')];
function openCourse(id,{focus=false}={}){
  menuButtons.forEach(button=>{
    const active=button.dataset.menu===id;
    button.classList.toggle('active',active);
    button.setAttribute('aria-selected',String(active));
    button.tabIndex=active?0:-1;
    if(active&&focus)button.focus();
  });
  menuPanels.forEach(panel=>panel.hidden=panel.dataset.course!==id);
}
menuButtons.forEach(button=>button.addEventListener('click',()=>{
  openCourse(button.dataset.menu);
}));
menuButtons.forEach((button,index)=>button.addEventListener('keydown',event=>{
  const {key}=event;
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(key))return;
  event.preventDefault();
  let nextIndex=index;
  if(key==='Home')nextIndex=0;
  else if(key==='End')nextIndex=menuButtons.length-1;
  else if(key==='ArrowLeft')nextIndex=(index-1+menuButtons.length)%menuButtons.length;
  else nextIndex=(index+1)%menuButtons.length;
  openCourse(menuButtons[nextIndex].dataset.menu,{focus:true});
}));

// ---- Leave screen: recap + personal QR to the correct .buzz store ----
const leaveRecap=document.querySelector('#leave-recap');
const leaveQr=document.querySelector('#leave-qr');
const leaveStoreName=document.querySelector('#leave-store-name');
const leaveStoreUrl=document.querySelector('#leave-store-url');
const leaveStatus=document.querySelector('#leave-status');
const leaveShareButton=document.querySelector('#leave-share');
const leaveCopyButton=document.querySelector('#leave-copy');

function storeForJourney(){
  const journey=loadJourney();
  if(journey.side==='adult')return {name:'The Nurtured Chef',url:'https://thenurturedchef.buzz/',host:'thenurturedchef.buzz'};
  return {name:'Whole Donuts',url:'https://wholedonuts.buzz/',host:'wholedonuts.buzz'};
}

function renderLeave(){
  const journey=loadJourney();
  const store=storeForJourney();
  if(leaveStoreName)leaveStoreName.textContent=store.name;
  if(leaveStoreUrl)leaveStoreUrl.textContent=store.host;
  if(leaveRecap){
    const parts=[];
    if(journey.side)parts.push(journey.side==='adult'?'you came in on the Adult side':'you came in on the Youth side');
    if(journey.face)parts.push('feeling '+journey.face);
    if(journey.need)parts.push('looking for '+journey.need.toLowerCase());
    leaveRecap.textContent=parts.length
      ?'Your visit so far: '+parts.join(', ')+'. The table is still open whenever you want more.'
      :'You found the table. That is enough for today.';
  }
  if(leaveQr){
    leaveQr.replaceChildren();
    if(typeof qrcode==='function'){
      try{
        const qr=qrcode(0,'M');
        qr.addData(store.url);
        qr.make();
        leaveQr.innerHTML=qr.createSvgTag({cellSize:4,margin:8});
      }catch(e){
        const fallback=document.createElement('p');
        fallback.textContent='Your personal route: '+store.url;
        leaveQr.append(fallback);
      }
    }else{
      const fallback=document.createElement('p');
      const link=document.createElement('a');
      link.href=store.url;
      link.textContent=store.url;
      fallback.textContent='Your personal route: ';
      fallback.append(link);
      leaveQr.append(fallback);
    }
  }
}

function setLeaveStatus(message){
  if(leaveStatus)leaveStatus.textContent=message;
}
if(leaveCopyButton)leaveCopyButton.addEventListener('click',async()=>{
  if(await copyText(invitationUrl)){
    setLeaveStatus('Invitation link copied. It contains no personal or referral information.');
  }else{
    setLeaveStatus('The invitation link could not be copied. You can share https://wenevergonnaclose.com/ directly.');
  }
});
if(leaveShareButton)leaveShareButton.addEventListener('click',async()=>{
  if(!navigator.share){
    if(leaveCopyButton)leaveCopyButton.click();
    return;
  }
  try{
    await navigator.share({title:'+U Movement',text:'Every crumb becomes part of the whole. Join the +U table.',url:invitationUrl});
    setLeaveStatus('Invitation shared. No recipient, referral, reward, or payment record was created.');
  }catch(e){
    setLeaveStatus('Sharing was closed. No invitation, payment, referral, or reward record was created.');
  }
});

const dateLabel=document.querySelector('#daily-date');
if(dateLabel)dateLabel.textContent=new Intl.DateTimeFormat(undefined,{weekday:'long',month:'long',day:'numeric'}).format(new Date());

if(menuButtons.length)openCourse('bits');

addEventListener('hashchange',()=>showScreen(routeFromHash(),{focus:true}));
showScreen(routeFromHash(),{focus:location.hash.length>1});
window.__wdRouterReady=true;