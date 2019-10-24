//
// 
// curent section counter 
// 
// 



function sectionNumber() {
	//add div to document
	let sectionNumber = document.createElement("div");
	sectionNumber.classList.add("section-number");
	document.body.appendChild(sectionNumber);
	const targets = document.querySelectorAll(".sectionCounter");
	
	observer = new IntersectionObserver(entries => {
	  entries.forEach(entry => {
		// additional check current section number != current id
		if (entry.intersectionRatio > 0 && sectionNumber.textContent != entry.target.dataset.id) {
			sectionNumber.classList.remove("sn-animation");
			// some timers for smoth animation
			setTimeout( function() {
				sectionNumber.textContent = entry.target.dataset.id;
			}, 200);
			setTimeout( function() {
				sectionNumber.classList.add("sn-animation");
			}, 200);
		} 
	  });
	}, {
			threshold: 0.8 //visibility of object to change counter
	   });
	
	targets.forEach(section => {
		observer.observe(section);
	});
}

if (window.innerWidth >= 768) {
	sectionNumber()
}


//
// 
// curent section counter end
// 
// 

// 
// price section
// 
// 


// function to add support for load JSON data in tickets block
// need to add animation

function priceChanger(arr) {
	let abonamentList = document.querySelectorAll(".main-block");
	let priceButtons = document.querySelectorAll(".price-btn");

	for (let i = 0; i < priceButtons.length; i++) {
		let tmpBtn = priceButtons[i];
		tmpBtn.addEventListener("click", function() {
			for (btn of priceButtons) {
				btn.classList.remove("selected");
			}
			tmpBtn.classList.add("selected");
			abonamentList[0].querySelector(".price").textContent = arr[i].morning + " $"; 	
			abonamentList[1].querySelector(".price").textContent = arr[i].full + " $"; 		
			abonamentList[2].querySelector(".price").textContent = arr[i].evening + " $"; 				
		})
	}
}

// 
// price section end
// 
// 

// 
// 
// teachers list pages
// 
// 

let teachersData;

let teachersDataReqest = new XMLHttpRequest();
teachersDataReqest.open("GET", "data.json", "true");
teachersDataReqest.responseType = "json";
teachersDataReqest.send();

let currentPage = 1;
let recordsPerPage = document.documentElement.clientWidth >= 768 ? 3 : 1;

let listingTable = teachersList.querySelector("ul");
let itemsList = listingTable.getElementsByClassName("teacher-item");
let reviewsList = document.querySelector(".ant-carousel-list");

let navBox = teachersList.querySelector(".navigation");
let totalPages = navBox.querySelector(".total-pages");
let btnNext = navBox.querySelector(".forward-btn");
let btnPrev = navBox.querySelector(".back-btn");


// total count of pages
let numPages;

function changeBtnState(btnPrev, btnNext) {
	if (currentPage == 1) {
		btnPrev.classList.remove("back-btn");
        btnPrev.classList.add("back-btn-disactive");
    } else {
		btnPrev.classList.remove("back-btn-disactive");
        btnPrev.classList.add("back-btn");
    }

    if (currentPage == numPages) {
		btnNext.classList.remove("forward-btn");
        btnNext.classList.add("forward-btn-disactive");
    } else {
		btnNext.classList.remove("forward-btn-disactive");
        btnNext.classList.add("forward-btn");
    }
}


// eventListeners fo click on btns
function addBtnListener(backward, forward) {
	backward.addEventListener("click", function() {
		if (currentPage > 1) {
			currentPage--;
			changePage(currentPage);
		}
	});
	forward.addEventListener("click", function() {
		if (currentPage < numPages) {
			currentPage++;
			changePage(currentPage);
		}
	});
}

function changeTeacherInfo(source) {
	let teacherAbout = document.querySelector(".teacher-about");

	teacherAbout.classList.remove("full-opacity")
	setTimeout( () => {
		let experience = teacherAbout.querySelector(".experience");
		teacherAbout.querySelector("h3").textContent = source.name;
		experience.textContent = experience.dataset.exp + source.experience;
		teacherAbout.querySelector("p").innerHTML = source.about;
		teacherAbout.classList.add("full-opacity");

	}, 200 );
}

function generateReviewBox(reviewsArray) {
	for (itm of reviewsArray) {
		let newItm = document.querySelector("#review-post-template")
			.content.querySelector(".review-post")
			.cloneNode(true);
		newItm.querySelector(".review-text").innerHTML = itm.text;
		newItm.querySelector(".name").textContent = itm.name;
		newItm.querySelector(".date").textContent = itm.date;
		reviewsList.append(newItm);
		if (itm.vkLink) {
			let tmp = newItm.querySelector(".vk-btn")
			tmp.href = itm.vkLink;
			tmp.classList.remove("hidden");
		}
		if (itm.fbLink) {
			let tmp = newItm.querySelector(".fb-btn")
			tmp.href = itm.fbLink;
			tmp.classList.remove("hidden");
		}
		if (itm.twLink) {
			let tmp = newItm.querySelector(".tw-btn")
			tmp.href = itm.twLink;
			tmp.classList.remove("hidden");
		}
	}
}

function generateTeacherBox(page) {
	for (let i = (page-1) * recordsPerPage; i < (page * recordsPerPage) && i < teachersData.length; i++) {
		let newItm = teachersList.querySelector("#teacher-item-template")
			.content.querySelector(".teacher-item")
			.cloneNode(true);
		newItm.querySelector("img").src = teachersData[i].photo;
		newItm.querySelector(".teacher-name").textContent = teachersData[i].name;
		newItm.querySelector(".lesson-type").textContent = teachersData[i].lesson;
		newItm.querySelector(".see-more").addEventListener( "click", () => changeTeacherInfo(teachersData[i]) );
		if (teachersData[i].vkLink) {
			let tmp = newItm.querySelector(".vk-btn")
			tmp.href = teachersData[i].vkLink;
			tmp.classList.remove("hidden");
		}
		if (teachersData[i].fbLink) {
			let tmp = newItm.querySelector(".fb-btn")
			tmp.href = teachersData[i].fbLink;
			tmp.classList.remove("hidden");
		}
		if (teachersData[i].twLink) {
			let tmp = newItm.querySelector(".tw-btn")
			tmp.href = teachersData[i].twLink;
			tmp.classList.remove("hidden");
		}
		listingTable.append(newItm);
		setTimeout(() => {newItm.classList.add("full-opacity")},
			(i - page * recordsPerPage + recordsPerPage + 1) * 100);
	}
}

function changePage(page) { 
	// some variables for navigation
	let navBox = teachersList.querySelector(".navigation");
	let crntPage = navBox.querySelector(".crnt-page");

    // Validate page
    if (page < 1) page = 1;
	if (page > numPages) page = numPages;

	// if list is empty dont clear list animation else animate
	if (!listingTable.childElementCount) {
		generateTeacherBox(page);
	} else 	{
		let listingTableTmp = listingTable.querySelectorAll(".teacher-item");
		for (let i = 0; i < itemsList.length; i++) {
			listingTableTmp[i].classList.remove("full-opacity");
			setTimeout( () => listingTableTmp[i].remove(), 200 )
		}
		setTimeout( function() {
			generateTeacherBox(page)
		},200)	
	}
	changeTeacherInfo(teachersData[page * recordsPerPage - recordsPerPage])
	crntPage.textContent = page;
	
	changeBtnState(btnPrev, btnNext)
}

// 
// 
// teachers list pages end
// 
//

// 
// 
// carousel script
// 
// 

function Ant(crslId) {

	let id = document.getElementById(crslId);
	if(id) {
		this.crslRoot = id
	}
	else {
		this.crslRoot = document.querySelector('.ant-carousel')
	};

	// Carousel objects
	this.crslList = this.crslRoot.querySelector('.ant-carousel-list');
	this.crslElements = this.crslList.querySelectorAll('.review-post');
	this.crslElemFirst = this.crslList.querySelector('.review-post');
	this.leftArrow = this.crslRoot.querySelector('div.ant-carousel-arrow-left');
	this.rightArrow = this.crslRoot.querySelector('div.ant-carousel-arrow-right');
	this.indicatorDots = this.crslRoot.querySelector('div.ant-carousel-dots');

	// Initialization
	this.options = Ant.defaults;
	Ant.initialize(this)
};

Ant.defaults = {

	// Default options for the carousel
	elemVisible: function() {
		if (document.documentElement.clientWidth >= 768) {
			return 2;
		}
		return 1;
	}  , // Кол-во отображаемых элементов в карусели
	loop: true,     // Бесконечное зацикливание карусели 
	auto: true,     // Автоматическая прокрутка
	interval: 10000, // Интервал между прокруткой элементов (мс)
	speed: 750,     // Скорость анимации (мс)
	touch: true,    // Прокрутка  прикосновением
	arrows: true,   // Прокрутка стрелками
};

Ant.prototype.elemPrev = function(num) {
	num = num || 1;

	if(!this.options.loop) {  // сдвиг вправо без цикла
		this.currentOffset += this.elemWidth*num;
		this.crslList.style.marginLeft = this.currentOffset + 'px';
		if(this.currentElement == 0) {
			this.leftArrow.style.display = 'none'; this.touchPrev = false
		}
		this.rightArrow.style.display = 'block'; this.touchNext = true
	}
	else {                    // сдвиг вправо с циклом
		let elm, buf, this$ = this;
		for(let i=0; i<num; i++) {
			elm = this.crslList.lastElementChild;
			buf = elm.cloneNode(true);
			this.crslList.insertBefore(buf, this.crslList.firstElementChild);
			this.crslList.removeChild(elm)
		};
		this.crslList.style.marginLeft = '-' + this.elemWidth*num + 'px';
		let compStyle = window.getComputedStyle(this.crslList).marginLeft;
		this.crslList.style.cssText = 'transition:margin '+this.options.speed+'ms ease;';
		this.crslList.style.marginLeft = '0px';
		setTimeout(function() {
			this$.crslList.style.cssText = 'transition:none;'
		}, this.options.speed)
	}
};

Ant.prototype.elemNext = function(num) {
	num = num || 1;

	if(!this.options.loop) {  // сдвиг влево без цикла
		this.currentOffset -= this.elemWidth*num;
		this.crslList.style.marginLeft = this.currentOffset + 'px';
		this.leftArrow.style.display = 'block'; this.touchPrev = true
	}
	else {                    // сдвиг влево с циклом
		let elm, buf, this$ = this;
		this.crslList.style.cssText = 'transition:margin '+this.options.speed+'ms ease;';
		this.crslList.style.marginLeft = '-' + this.elemWidth*num + 'px';
		setTimeout(function() {
			this$.crslList.style.cssText = 'transition:none;';
			for(let i=0; i<num; i++) {
				elm = this$.crslList.firstElementChild;
				buf = elm.cloneNode(true); this$.crslList.appendChild(buf);
				this$.crslList.removeChild(elm)
			};
			this$.crslList.style.marginLeft = '0px'
		}, this.options.speed)
	}
};

Ant.initialize = function(that) {

	// Constants
	that.elemCount = that.crslElements.length; // Количество элементов
	that.dotsVisible = that.elemCount;         // Число видимых точек
	let elemStyle = window.getComputedStyle(that.crslElemFirst);
	that.elemWidth = that.crslElemFirst.offsetWidth +  // Ширина элемента (без margin)
	  parseInt(elemStyle.marginLeft) + parseInt(elemStyle.marginRight);

	// Variables
	that.currentElement = 0; that.currentOffset = 0;
	that.touchPrev = true; that.touchNext = true;
	let xTouch, yTouch, xDiff, yDiff, stTime, mvTime;
	let bgTime = getTime();

	// Functions
	function getTime() {
		return new Date().getTime();
	};
	function setAutoScroll() {
		that.autoScroll = setInterval(function() {
			let fnTime = getTime();
			if(fnTime - bgTime + 10 > that.options.interval) {
				bgTime = fnTime; that.elemNext()
			}
		}, that.options.interval)
	};

	// Start initialization
	if(that.elemCount <= that.options.elemVisible) {   // Отключить навигацию
		that.options.auto = false; that.options.touch = false;
		that.options.arrows = false; that.options.dots = false;
		that.leftArrow.style.display = 'none'; that.rightArrow.style.display = 'none'
	};

	if(!that.options.loop) {       // если нет цикла - уточнить количество точек
		that.dotsVisible = that.elemCount - that.options.elemVisible + 1;
		that.leftArrow.style.display = 'none';  // отключить левую стрелку
		that.touchPrev = false;    // отключить прокрутку прикосновением вправо
		that.options.auto = false; // отключить автопркрутку
	}
	else if(that.options.auto) {   // инициализация автопрокруки
		setAutoScroll();
		// Остановка прокрутки при наведении мыши на элемент
		that.crslList.addEventListener('mouseenter', function() {
    	clearInterval(that.autoScroll)
    }, false);
		that.crslList.addEventListener('mouseleave', setAutoScroll, false)
	};

	if(that.options.touch) {   // инициализация прокрутки прикосновением
		that.crslList.addEventListener('touchstart', function(e) {
			xTouch = parseInt(e.touches[0].clientX);
			yTouch = parseInt(e.touches[0].clientY);
			stTime = getTime()
		}, false);
		that.crslList.addEventListener('touchmove', function(e) {
			if(!xTouch || !yTouch) return;
			xDiff = xTouch - parseInt(e.touches[0].clientX);
			yDiff = yTouch - parseInt(e.touches[0].clientY);
			mvTime = getTime();
			if(Math.abs(xDiff) > 15 && Math.abs(xDiff) > Math.abs(yDiff) && mvTime - stTime < 75) {
				stTime = 0;
				if(that.touchNext && xDiff > 0) {
					bgTime = mvTime; that.elemNext()
				}
				else if(that.touchPrev && xDiff < 0) {
					bgTime = mvTime; that.elemPrev()
				}
			}
		}, false)
	};

	if(that.options.arrows) {  // инициализация стрелок
		if(!that.options.loop) that.crslList.style.cssText =
      'transition:margin '+that.options.speed+'ms ease;';
		that.leftArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > that.options.speed) {
				bgTime = fnTime; that.elemPrev()
			}
		}, false);
		that.rightArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > that.options.speed) {
				bgTime = fnTime; that.elemNext()
			}
		}, false)
	}
	else {
		that.leftArrow.style.display = 'none';
    that.rightArrow.style.display = 'none'
	};
};



teachersDataReqest.onload = function() {
	addBtnListener(btnPrev, btnNext);

	teachersData = teachersDataReqest.response.teacherData;
	numPages = Math.ceil(teachersData.length / recordsPerPage);

	changePage(1);
	generateReviewBox(teachersDataReqest.response.reviewsData);
	priceChanger(teachersDataReqest.response.ticketsPrice);

	changeTeacherInfo(teachersData[0]);
	totalPages.textContent = numPages;

	new Ant();
}