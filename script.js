//
// 
// curent section counter 
// 
// 

//add div to document
let sectionNumber = document.createElement("div");
sectionNumber.classList.add("section-number");
if (window.innerWidth >= 768) {
	document.body.appendChild(sectionNumber);
}

let teachersData;

let teachersDataReqest = new XMLHttpRequest();
teachersDataReqest.open("GET", "data.json", "true");
teachersDataReqest.responseType = "json";
teachersDataReqest.send();

teachersDataReqest.onload = function() {
	teachersData = teachersDataReqest.response;
}


console.log(teachersData);

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
		threshold: 0.7 //visibility of object to change counter
   });

targets.forEach(section => {
  observer.observe(section);
});

//
// 
// curent section counter end
// 
// 

// 
// 
// teachers list pages
// 
// 

let currentPage = 1;
let recordsPerPage = window.innerWidth >= 768 ? 3 : 1;

// some variables for navigation
let navBox = teachersList.querySelector(".navigation");
let btnNext = navBox.querySelector(".forward-btn");
let btnPrev = navBox.querySelector(".back-btn");
let crntPage = navBox.querySelector(".crnt-page");
let totalPages = navBox.querySelector(".total-pages");

let listingTable = teachersList.querySelector("ul");
let teacherTemplate = teachersList.querySelector("#teacher-item-template").content.querySelector(".teacher-item");
let teacherAbout = document.querySelector(".teacher-about");

// total count of pages
let numPages = Math.ceil(teachersData.length / recordsPerPage);
totalPages.textContent = numPages;

// eventListeners fo click on btns
btnPrev.addEventListener("click", function() {
   	if (currentPage > 1) {
        currentPage--;
        changePage(currentPage);
	}
});
btnNext.addEventListener("click", function() {
	if (currentPage < numPages) {
		currentPage++;
		changePage(currentPage);
	}
});

function changeTeacherInfo(source) {
	teacherAbout.classList.remove("full-opacity")
	setTimeout( () => {
		let experience = teacherAbout.querySelector(".experience");
		teacherAbout.querySelector("h3").textContent = source.name;
		experience.textContent = experience.dataset.exp + source.experience;
		teacherAbout.querySelector("p").innerHTML = source.about;
		teacherAbout.classList.add("full-opacity");

	}, 200 );
}

function generateItems(page) {
	for (let i = (page-1) * recordsPerPage; i < (page * recordsPerPage) && i < teachersData.length; i++) {
		let newItm = teacherTemplate.cloneNode(true);
		newItm.querySelector("img").src = teachersData[i].foto;
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
		listingTable.appendChild(newItm);
		setTimeout(() => {newItm.classList.add("full-opacity")},
			(i - page * recordsPerPage + recordsPerPage + 1) * 100);
	}
}

function changePage(page) { 
    // Validate page
    if (page < 1) page = 1;
	if (page > numPages) page = numPages;

	// if list is empty dont clear list animation else animate
	if (!listingTable.childElementCount) {
		generateItems(page);
	} else 	{
		let listingTableTmp = listingTable.querySelectorAll(".teacher-item");
		for (let i = 0; i < recordsPerPage; i++) {
			listingTableTmp[i].classList.remove("full-opacity");
			setTimeout( () => listingTableTmp[i].remove(), 200 )
		}
		setTimeout( function() {
			generateItems(page)
		},200)	
	}
	changeTeacherInfo(teachersData[page * recordsPerPage - recordsPerPage])
    crntPage.textContent = page;

	// change style of btns when shown first or last page
    if (page == 1) {
		btnPrev.classList.remove("back-btn");
        btnPrev.classList.add("back-btn-disactive");
    } else {
		btnPrev.classList.remove("back-btn-disactive");
        btnPrev.classList.add("back-btn");
    }

    if (page == numPages) {
		btnNext.classList.remove("forward-btn");
        btnNext.classList.add("forward-btn-disactive");
    } else {
		btnNext.classList.remove("forward-btn-disactive");
        btnNext.classList.add("forward-btn");
    }
}

// on document load show first page
window.onload = function() {
	changePage(1);
	changeTeacherInfo(teachersData[0])
};

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
		if (window.innerWidth >= 768) {
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

new Ant();