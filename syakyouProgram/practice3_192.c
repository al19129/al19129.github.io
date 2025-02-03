#include <stdio.h>
int main(void){
    int a = 5;
    double b = 5.5;
    int *pa;
    double *pb;
    pa = &a;
    pb = &b;
    printf("a:%d\n",*pa);
    printf("b:%f\n",*pb);
    return 0;
}