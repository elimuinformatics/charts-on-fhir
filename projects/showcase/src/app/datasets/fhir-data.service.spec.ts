import {
    HttpClientTestingModule,
    HttpTestingController,
  } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FhirDataService } from './fhir-data.service';
  
  
  
  describe('BooksService', () => {
    let service: FhirDataService;
    let httpController: HttpTestingController;
  
      let url = 'localhost:3000/';
      
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
          });
          service = TestBed.inject(FhirDataService);
          httpController = TestBed.inject(HttpTestingController);
        });
  
  
      it('should call getAllBooks and return an array of Books', () => {
              
              // 1
            service.getMedicationsOrder().subscribe((res) => {
                  //2

                  console.log('res ===> ', res)
            const test = []      
            // expect(res).toEqual(test);
          });
      
              //3
          const req = httpController.expectOne({
            method: 'GET',
            url: `${url}/books`,
          });
  
              //4
        //   req.flush(mockBookArray);
        });
  });